import os
import requests
from pathlib import Path
from bs4 import BeautifulSoup
import jinja2
import yaml
import logging
from PIL import Image
from io import BytesIO

GITHUB_TOKEN = os.environ['API_TOKEN']
BRANCHES = ['v1', 'main', 'master'] # V1 is a bit random here but it is SCS_RPC2 requirement
CS_DIR = Path(os.environ.get('CS_DIR', '../hugo/content/cs/projects'))
EN_DIR = Path(os.environ.get('EN_DIR', '../hugo/content/en/projects'))
STATIC_DIR = Path('../hugo/static/assets/img/projects')
STATIC_ROOT_DIR = Path('../hugo/static')
TEMPLATE_FILE = Path('../templates/repo_template.j2')

HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)

# Load Jinja2 template
env = jinja2.Environment(loader=jinja2.FileSystemLoader(str(TEMPLATE_FILE.parent)))
template = env.get_template(TEMPLATE_FILE.name)

def clear_content_dirs():
    logger.info("Clearing content directories")
    for folder in [CS_DIR, EN_DIR]:
        if folder.exists():
            logger.info(f"Removing markdown files in {folder}")
            for file in folder.glob("*.md"):
                file.unlink()
        else:
            logger.info(f"Creating directory {folder}")
            folder.mkdir(parents=True)

    if not STATIC_DIR.exists():
        logger.info(f"Creating static image directory {STATIC_DIR}")
        STATIC_DIR.mkdir(parents=True)
    logger.info(f"Removing existing images in {STATIC_DIR}")
    for img in STATIC_DIR.glob("*"):
        img.unlink()

def get_img_url(readme_text):
    soup = BeautifulSoup(readme_text, 'html.parser')
    img = soup.find('img')
    return img['src'] if img else ""


def get_localized_description(readme_text):
    soup = BeautifulSoup(readme_text, 'html.parser')
    center = soup.find('center')
    if center:
        text = center.get_text(separator="\n").strip()
        lines = text.splitlines()
        if len(lines) >= 3:
            return lines[2].strip()
    return ""

def fetch_pinned_repos():
    logger.info("Fetching pinned repositories from GitHub GraphQL")
    query = '''
    {
      viewer {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              licenseInfo { name }
              homepageUrl
              stargazerCount
              releases(first: 100) { nodes { releaseAssets(first: 100) { nodes { downloadCount } } } }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges { size node { name color } }
              }
              forkCount
            }
          }
        }
      }
    }
    '''
    resp = requests.post("https://api.github.com/graphql", json={"query": query}, headers=HEADERS)
    resp.raise_for_status()
    repos = resp.json()['data']['viewer']['pinnedItems']['nodes']
    logger.info(f"Fetched {len(repos)} pinned repositories")
    return repos

def fetch_readme(repo, code):
    logger.info(f"Fetching README for {repo['name']} ({code})")
    code = '.cz' if code == 'cs' else ''
    for branch in BRANCHES:
      url = f"https://raw.githubusercontent.com/Tarasa24/{repo['name']}/refs/heads/{branch}/README{code}.md"
      resp = requests.get(url)
      if resp.status_code == 200:
          logger.info(f"Found README for {repo['name']} on branch {branch} ({'cs' if code else 'en'})")
          return resp.text
      continue
    logger.warning(f"README not found for {repo['name']} ({'cs' if code else 'en'}) on branches: {', '.join(BRANCHES)}")
    return ""

def fetch_and_save_image(url, name):
    if not url:
        logger.info(f"No image URL found for {name}, skipping image download")
        return
    img_path = STATIC_DIR / f"{name}.png"
    if img_path.exists():
        logger.info(f"Image already exists for {name}, skipping")
        return
    try:
        logger.info(f"Downloading image for {name} from {url}")
        # Emulate browser headers to avoid potential blocking
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        with img_path.open('wb') as f:
            f.write(resp.content)
        logger.info(f"Saved image for {name} to {img_path}")
    except Exception as e:
        logger.warning(f"Failed to fetch image for {name}: {e}")

def fetch_and_generate_favicon():
    logger.info("Fetching GitHub profile picture for favicon")
    try:
        # Fetch user info to get avatar URL
        query = '''
        {
          viewer {
            avatarUrl(size: 512)
          }
        }
        '''
        resp = requests.post("https://api.github.com/graphql", json={"query": query}, headers=HEADERS)
        resp.raise_for_status()
        avatar_url = resp.json()['data']['viewer']['avatarUrl']
        logger.info(f"Found avatar URL: {avatar_url}")
        
        # Download the avatar image
        logger.info("Downloading avatar image")
        img_resp = requests.get(avatar_url, headers={"User-Agent": "Mozilla/5.0"})
        img_resp.raise_for_status()
        
        # Convert to ICO format
        logger.info("Converting image to favicon.ico")
        img = Image.open(BytesIO(img_resp.content))
        # Convert RGBA to RGB if needed (ICO format requirement)
        if img.mode == 'RGBA':
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to common favicon sizes and save as ICO
        favicon_path = STATIC_ROOT_DIR / 'favicon.ico'
        img.save(favicon_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
        logger.info(f"Successfully generated favicon at {favicon_path}")
        
    except Exception as e:
        logger.error(f"Failed to generate favicon: {e}")
        raise

def generate_markdown(repo):
    name = repo['name']
    logger.info(f"Generating markdown for repository: {name}")
    desc = repo['description'] or ""
    license_name = repo['licenseInfo']['name'] if repo['licenseInfo'] else ""
    homepage = repo['homepageUrl'] or ""
    stars = repo['stargazerCount']
    total_downloads = 0
    for release in repo['releases']['nodes']:
        for asset in release['releaseAssets']['nodes']:
            total_downloads += asset['downloadCount']

    # Languages top 3
    lang_edges = repo['languages']['edges']
    total_size = sum(e['size'] for e in lang_edges) if lang_edges else 1
    lang_list = [
        {"language": e['node']['name'], "color": e['node']['color'], "ratio": round(e['size']/total_size, 2)}
        for e in lang_edges[:3]
    ]

    # Generate files for cs and en
    for code, folder in [('cs', CS_DIR), ('en', EN_DIR)]:
        logger.info(f"Rendering {code} content for {name}")
        readme_content = fetch_readme(repo, code)
        img_url = get_img_url(readme_content)
        fetch_and_save_image(img_url, name)
        localized_desc = get_localized_description(readme_content)
        frontmatter = {
            "title": name,
            "description": localized_desc if localized_desc else desc,
            "stars": stars,
            "downloads": total_downloads,
            "forks": repo['forkCount'],
            "license": license_name,
            "homepage_url": homepage,
            "repo_url": f"https://github.com/Tarasa24/{name}",
            "lang": lang_list
        }
        folder.mkdir(exist_ok=True)
        md_content = template.render(frontmatter=frontmatter, readme=readme_content)
        out_file = folder / f"{name}.md"
        with out_file.open('w', encoding='utf-8') as f:
            f.write(md_content)
        logger.info(f"Wrote markdown file: {out_file}")

if __name__ == "__main__":
    logger.info("Starting pinned repo content generation")
    clear_content_dirs()
    repos = fetch_pinned_repos()
    for repo in repos:
        generate_markdown(repo)
    logger.info("Finished pinned repo content generation")
    
    logger.info("Generating favicon from GitHub profile picture")
    fetch_and_generate_favicon()
    logger.info("Build-time generation complete")
