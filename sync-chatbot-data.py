import json
import re
import os

def extract_projects_from_html(html_path):
    if not os.path.exists(html_path):
        print(f"Error: {html_path} not found")
        return []

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the project grid section
    projects_section = re.search(r'<div class="proj-bento stg">(.*?)<!-- Footer -->', content, re.DOTALL)
    if not projects_section:
        # Fallback to a broader search if footer comment isn't there
        projects_section = re.search(r'<div class="proj-bento stg">(.*?)<footer', content, re.DOTALL)
    
    html_chunk = projects_section.group(1) if projects_section else content

    projects = []
    
    # Helper: strip all HTML tags and normalize whitespace
    def clean_html(text):
        """Remove all HTML tags and normalize whitespace."""
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    # Helper: extract clean pill text from tech stack divs
    def extract_pills(tech_html):
        """Extract only the text content from <span class="pill*"> tags."""
        # First try to get just pill tag contents
        pills = re.findall(r'<span[^>]*class="pill[^"]*"[^>]*>(.*?)</span>', tech_html, re.DOTALL)
        if pills:
            return ', '.join(clean_html(p) for p in pills if clean_html(p))
        # Fallback: strip all tags but stop before <a or <svg elements
        truncated = re.split(r'<a\s|<svg\s', tech_html)[0]
        return clean_html(truncated)
    
    # Pattern 1: Simple/Bento cards (e.g., Personal AI Employee, Solana)
    # <div class="pnm">Project Name</div>
    # <p class="pdsc">Description</p>
    bento_pattern = re.findall(r'<div class="pnm">(.*?)</div>.*?<p class="pdsc">(.*?)</p>.*?<div class="pstk">(.*?)</div>', html_chunk, re.DOTALL)
    for name, desc, tech_html in bento_pattern:
        clean_name = clean_html(name)
        clean_desc = clean_html(desc)
        clean_tech = extract_pills(tech_html)
        projects.append({
            "repo_name": clean_name,
            "type": "repository",
            "content": f"Description: {clean_desc} Tech Stack: {clean_tech}.",
            "year": "2026"
        })

    # Pattern 2: Detailed preview cards (e.g., AutoGrader, CareerPilot)
    # <h3 class="p-title-large">Project Name</h3>
    # <p class="p-desc-large">Description</p>
    detailed_pattern = re.findall(r'<h3 class="p-title-large">(.*?)</h3>.*?<p class="p-desc-large">(.*?)</p>.*?<div class="pstk">(.*?)</div>', html_chunk, re.DOTALL)
    for name, desc, tech_html in detailed_pattern:
        clean_name = clean_html(name)
        clean_desc = clean_html(desc)
        clean_tech = extract_pills(tech_html)
        
        # Avoid duplicates from Pattern 1
        if any(p['repo_name'] == clean_name for p in projects):
            continue
            
        projects.append({
            "repo_name": clean_name,
            "type": "repository",
            "content": f"Description: {clean_desc} Tech Stack: {clean_tech}.",
            "year": "2026"
        })

    return projects

def sync():
    # Load existing embeddings to keep profile/skills content
    try:
        with open('embeddings.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        data = {"chunks": []}

    # Keep non-repository chunks (profile, skills, etc.)
    new_chunks = [chunk for chunk in data.get('chunks', []) if chunk.get('type') != 'repository']
    
    # Extract new repository chunks from index.html
    html_projects = extract_projects_from_html('index.html')
    
    # Add new projects
    new_chunks.extend(html_projects)
    
    data['chunks'] = new_chunks
    data['last_updated'] = "2026-04-14"

    with open('embeddings.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Synced {len(html_projects)} projects from index.html to embeddings.json")
    for p in html_projects:
        print(f"   • {p['repo_name']}: {p['content'][:80]}...")

if __name__ == "__main__":
    sync()
