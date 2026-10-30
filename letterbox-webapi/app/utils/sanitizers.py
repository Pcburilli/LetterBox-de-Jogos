import html
import re

def clean_html_text(text: str) -> str:
    "Remove tags HTML, decodifica entidades HTML e limpa espaços extras."
    if not text:
        return ""
    
    text = html.unescape(text)
    text = re.sub(r'<[^>]+>', '', text)
    
    return text.strip()