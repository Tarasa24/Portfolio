(() => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const workerUrl = (form.dataset.workerUrl || "").trim();
    const pubkeyUrl = (form.dataset.pubkeyUrl || "/assets/pubkey.asc").trim();
    const isDev = form.dataset.dev === "true";
    const statuses = {
        sent: form.dataset.statusSent || "Sent",
        error: form.dataset.statusError || "Something went wrong",
        encrypting: form.dataset.statusEncrypting || "Encrypting...",
        sending: form.dataset.statusSending || "Sending...",
        missingTurnstile:
            form.dataset.statusMissingTurnstile || "Please complete the verification.",
        missingWorker:
            form.dataset.statusMissingWorker || "Contact form is not configured yet.",
        rateLimited:
            form.dataset.statusRateLimited || "Thanks for reaching out! You can send another message in 1 hour.",
    };

    const setStatus = (message, type) => {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.remove("is-error", "is-success");
        if (type === "error") {
            statusEl.classList.add("is-error");
        }
        if (type === "success") {
            statusEl.classList.add("is-success");
        }
    };

    const setBusy = (isBusy) => {
        form.classList.toggle("is-busy", isBusy);
        if (submitBtn) submitBtn.disabled = isBusy;
        if (statusEl) statusEl.setAttribute("aria-busy", isBusy ? "true" : "false");
    };

    const getTurnstileToken = () => {
        const tokenField = form.querySelector(
            'input[name="cf-turnstile-response"]'
        );
        return tokenField ? tokenField.value.trim() : "";
    };

    const loadPublicKey = async () => {
        const response = await fetch(pubkeyUrl, { cache: "force-cache" });
        if (!response.ok) {
            throw new Error("Failed to load public key.");
        }
        const armoredKey = await response.text();
        return window.openpgp.readKey({ armoredKey });
    };

    const encryptPayload = async (publicKey, payload) => {
        const message = await window.openpgp.createMessage({ text: payload });
        return window.openpgp.encrypt({
            message,
            encryptionKeys: publicKey,
            format: "armored",
        });
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!workerUrl) {
            setStatus(statuses.missingWorker, "error");
            return;
        }

        if (!window.openpgp) {
            setStatus(statuses.error, "error");
            return;
        }

        const turnstileToken = getTurnstileToken();
        if (!turnstileToken) {
            setStatus(statuses.missingTurnstile, "error");
            return;
        }

        setBusy(true);
        setStatus(statuses.encrypting);

        try {
            const publicKey = await loadPublicKey();
            const messagePlaintext = form.message.value.trim();
            const ciphertext = await encryptPayload(publicKey, messagePlaintext);
            const requestBody = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                ciphertext,
                locale: document.documentElement.lang || "en",
                createdAt: new Date().toISOString(),
                referrer: document.referrer || null,
                userAgent: navigator.userAgent,
                turnstileToken: turnstileToken || "dev-bypass",
                format: "openpgp",
                version: 1,
            };

            setStatus(statuses.sending);

            if (isDev) {
                console.log("Contact form request", {
                    url: workerUrl,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: requestBody,
                });
            }

            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.error === "rate_limit_exceeded") {
                    setStatus(statuses.rateLimited, "error");
                    form.reset();
                    if (window.turnstile && typeof window.turnstile.reset === "function") {
                        window.turnstile.reset();
                    }
                    const fieldset = form.querySelector("fieldset");
                    if (fieldset) fieldset.disabled = true;
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.disabled = true;
                    return;
                }
                throw new Error("Request failed.");
            }

            form.reset();
            if (window.turnstile && typeof window.turnstile.reset === "function") {
                window.turnstile.reset();
            }
            setStatus(statuses.sent, "success");

            // Disable the form after successful send
            const fieldset = form.querySelector("fieldset");
            if (fieldset) fieldset.disabled = true;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
        } catch (error) {
            console.error(error);
            setStatus(statuses.error, "error");
        } finally {
            setBusy(false);
        }
    });
})();
