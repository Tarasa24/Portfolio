const TURNSTILE_VERIFY_URL =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAILCHANNELS_URL = "https://api.mailchannels.net/tx/v1/send";
const RATE_LIMIT_PREFIX = "ratelimit:";

const jsonResponse = (data, status, headers) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
};

const getAllowedOrigin = (request, allowedOrigins) => {
    const origin = request.headers.get("Origin");
    if (!origin) return "";
    if (!allowedOrigins) return origin;

    const allowed = allowedOrigins
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    if (allowed.includes("*")) return origin;
    return allowed.includes(origin) ? origin : "";
};

const buildCorsHeaders = (request, env) => {
    const origin = getAllowedOrigin(request, env.ALLOWED_ORIGINS || "");
    if (!origin) return {};
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
    };
};

const verifyTurnstile = async (token, request, env) => {
    const ip = request.headers.get("CF-Connecting-IP");
    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET || "");
    body.set("response", token);
    if (ip) body.set("remoteip", ip);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        return { success: false, error: "turnstile_unavailable" };
    }

    const data = await response.json();
    return data;
};

const buildEmailBody = (payload) => {
    const lines = [
        payload.ciphertext,
        "",
        "---",
        "Metadata:",
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Locale: ${payload.locale || "unknown"}`,
        `Created At: ${payload.createdAt || "unknown"}`,
        `Referrer: ${payload.referrer || ""}`,
        `User Agent: ${payload.userAgent || ""}`,
    ];
    return lines.join("\n");
};

const sendEmail = async (payload, env) => {
    const subject = `Portfolio contact from ${payload.name}`;
    const body = buildEmailBody(payload);
    const fromName = env.MAIL_FROM_NAME || "Portfolio Contact";

    const mailRequest = {
        personalizations: [
            {
                to: [{ email: env.MAIL_TO || "portfolio@tarasa24.dev" }],
            },
        ],
        from: {
            email: env.MAIL_FROM || "contact-form@tarasa24.dev",
            name: fromName,
        },
        reply_to: {
            email: payload.email,
            name: payload.name,
        },
        subject,
        content: [{ type: "text/plain", value: body }],
        headers: {
            "X-Contact-Email": payload.email,
            "X-Contact-Name": payload.name,
        },
    };

    const headers = { "Content-Type": "application/json" };
    if (env.MAILCHANNELS_API_KEY) {
        headers["X-Api-Key"] = env.MAILCHANNELS_API_KEY;
    }

    return fetch(MAILCHANNELS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(mailRequest),
    });
};

const parsePayload = async (request) => {
    try {
        return await request.json();
    } catch (error) {
        return null;
    }
};

const validatePayload = (payload) => {
    if (!payload) return "invalid_json";
    if (!payload.name || !payload.email || !payload.ciphertext) {
        return "missing_fields";
    }
    if (!payload.turnstileToken) {
        return "missing_turnstile";
    }
    return "";
};

const normalizeEmail = (email) => email.toLowerCase().trim();

const getRateLimitKey = (type, identifier) => {
    return `${RATE_LIMIT_PREFIX}${type}:${identifier}`;
};

const checkRateLimit = async (kv, type, identifier, maxRequests, windowHours) => {
    if (!kv) return { allowed: true };

    const key = getRateLimitKey(type, identifier);
    const data = await kv.get(key, "json");

    if (!data) {
        return { allowed: true, isNew: true };
    }

    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000;
    const recentRequests = data.requests.filter(
        (timestamp) => now - timestamp < windowMs
    );

    return {
        allowed: recentRequests.length < maxRequests,
        count: recentRequests.length,
        maxRequests,
    };
};

const updateRateLimit = async (kv, type, identifier, windowHours) => {
    if (!kv) return;

    const key = getRateLimitKey(type, identifier);
    const data = await kv.get(key, "json");

    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000;
    const requests = data?.requests || [];

    const recentRequests = requests.filter(
        (timestamp) => now - timestamp < windowMs
    );
    recentRequests.push(now);

    // TTL: window duration + 1 hour buffer
    const ttl = Math.ceil((windowHours * 60 * 60) + 3600);
    await kv.put(
        key,
        JSON.stringify({ requests: recentRequests }),
        { expirationTtl: ttl }
    );
};

export default {
    async fetch(request, env) {
        const corsHeaders = buildCorsHeaders(request, env);

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return jsonResponse(
                { ok: false, error: "method_not_allowed" },
                405,
                corsHeaders
            );
        }

        if (!env.TURNSTILE_SECRET) {
            return jsonResponse(
                { ok: false, error: "turnstile_not_configured" },
                500,
                corsHeaders
            );
        }

        const payload = await parsePayload(request);
        const error = validatePayload(payload);
        if (error) {
            return jsonResponse({ ok: false, error }, 400, corsHeaders);
        }

        const verification = await verifyTurnstile(
            payload.turnstileToken,
            request,
            env
        );

        if (!verification.success) {
            return jsonResponse(
                { ok: false, error: "turnstile_failed", details: verification },
                403,
                corsHeaders
            );
        }

        // Check rate limiting if enabled
        if (env.RATE_LIMIT_ENABLED === "true" || env.RATE_LIMIT_ENABLED === true) {
            const kv = env.RATE_LIMIT_KV;
            const normalizedEmail = normalizeEmail(payload.email);
            const ip = request.headers.get("CF-Connecting-IP") || "unknown";
            const emailMaxRequests = parseInt(env.RATE_LIMIT_EMAIL_MAX || "1", 10);
            const emailWindowHours = parseInt(env.RATE_LIMIT_EMAIL_WINDOW_HOURS || "1", 10);
            const ipMaxRequests = parseInt(env.RATE_LIMIT_IP_MAX || "5", 10);
            const ipWindowHours = parseInt(env.RATE_LIMIT_IP_WINDOW_HOURS || "1", 10);

            const emailLimit = await checkRateLimit(
                kv,
                "email",
                normalizedEmail,
                emailMaxRequests,
                emailWindowHours
            );
            if (!emailLimit.allowed) {
                return jsonResponse(
                    { ok: false, error: "rate_limit_exceeded", type: "email", retryAfter: emailWindowHours * 3600 },
                    429,
                    corsHeaders
                );
            }

            const ipLimit = await checkRateLimit(
                kv,
                "ip",
                ip,
                ipMaxRequests,
                ipWindowHours
            );
            if (!ipLimit.allowed) {
                return jsonResponse(
                    { ok: false, error: "rate_limit_exceeded", type: "ip", retryAfter: ipWindowHours * 3600 },
                    429,
                    corsHeaders
                );
            }
        }

        const mailResponse = await sendEmail(payload, env);
        if (!mailResponse.ok) {
            const details = await mailResponse.text();
            return jsonResponse(
                { ok: false, error: "email_failed", details },
                502,
                corsHeaders
            );
        }

        // Update rate limits after successful send
        if (env.RATE_LIMIT_ENABLED === "true" || env.RATE_LIMIT_ENABLED === true) {
            const kv = env.RATE_LIMIT_KV;
            const normalizedEmail = normalizeEmail(payload.email);
            const ip = request.headers.get("CF-Connecting-IP") || "unknown";
            const emailWindowHours = parseInt(env.RATE_LIMIT_EMAIL_WINDOW_HOURS || "1", 10);
            const ipWindowHours = parseInt(env.RATE_LIMIT_IP_WINDOW_HOURS || "1", 10);

            await updateRateLimit(kv, "email", normalizedEmail, emailWindowHours);
            await updateRateLimit(kv, "ip", ip, ipWindowHours);
        }

        return jsonResponse({ ok: true }, 200, corsHeaders);
    },
};
