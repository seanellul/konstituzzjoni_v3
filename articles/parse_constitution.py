import os
import json
import re
from datetime import datetime

def extract_articles_from_txt():
    # Use the correct path to the constitution.txt file - it's in the articles directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    constitution_path = os.path.join(current_dir, 'constitution.txt')
    
    with open(constitution_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Extract chapters and articles
    chapters = {}
    
    # First, identify all chapter headings
    chapter_pattern = r'CHAPTER\s+([IVX]+[A-Z]?)\s*\n\s*(.*?)\s*\n'
    chapter_matches = re.finditer(chapter_pattern, content)
    
    for match in chapter_matches:
        roman_numeral = match.group(1)
        chapter_title = match.group(2).strip()
        
        # Convert Roman numeral to integer
        if 'A' in roman_numeral:
            # Handle special case like "XA"
            base_numeral = roman_numeral.replace('A', '')
            chapter_num = roman_to_int(base_numeral)
            if roman_numeral.endswith('A'):
                chapter_name = f"{chapter_num}A"  # Keep the 'A' suffix
            else:
                chapter_name = str(chapter_num)
        else:
            chapter_num = roman_to_int(roman_numeral)
            chapter_name = str(chapter_num)
        
        chapters[roman_numeral] = {
            'number': chapter_name,
            'title': chapter_title,
            'articles': []
        }
    
    # Determine chapter boundaries
    chapter_boundaries = []
    chapter_positions = [(match.start(), match.group(1)) for match in re.finditer(chapter_pattern, content)]
    
    for i, (start_pos, chapter) in enumerate(chapter_positions):
        if i < len(chapter_positions) - 1:
            end_pos = chapter_positions[i + 1][0]
        else:
            end_pos = len(content)
        
        chapter_boundaries.append((chapter, start_pos, end_pos))
    
    # Now extract all articles with their content
    all_articles_data = []
    
    for chapter, chapter_start, chapter_end in chapter_boundaries:
        chapter_content = content[chapter_start:chapter_end]
        
        # Find all article headers in this chapter
        article_pattern = r'(\d+[A-Z]?)\.[\s\n]+(.*?)\.[\s\n]+'
        article_matches = list(re.finditer(article_pattern, chapter_content))
        
        for i, match in enumerate(article_matches):
            article_num = match.group(1)
            article_title = match.group(2).strip()
            
            # Get article content
            article_start = match.end()
            if i < len(article_matches) - 1:
                article_end = article_matches[i + 1].start()
            else:
                article_end = len(chapter_content)
            
            article_content = chapter_content[article_start:article_end].strip()
            
            # Parse the content into paragraphs
            paragraphs = []
            
            # Try to detect the format - numbered paragraphs or plain text
            numbered_para_pattern = r'\((\d+)\)\s*(.*?)(?=\(\d+\)|$)'
            numbered_paras = list(re.finditer(numbered_para_pattern, article_content, re.DOTALL))
            
            if numbered_paras:
                # Parse numbered paragraphs
                for para_idx, para_match in enumerate(numbered_paras):
                    para_num = int(para_match.group(1))
                    para_text = para_match.group(2).strip()
                    full_para_text = f"({para_num}) {para_text}"
                    
                    paragraphs.append({
                        "paragraph": para_num,
                        "text": full_para_text
                    })
                    
                    # Check for sub-paragraphs like (a), (b), etc.
                    subpara_pattern = r'\(([a-z])\)\s*(.*?)(?=\([a-z]\)|$)'
                    subpara_matches = list(re.finditer(subpara_pattern, para_text, re.DOTALL))
                    
                    for subpara_match in subpara_matches:
                        subpara_letter = subpara_match.group(1)
                        subpara_text = subpara_match.group(2).strip()
                        
                        # Check for nested sub-paragraphs like (i), (ii), etc.
                        roman_pattern = r'\((i{1,3}|iv|v|vi{1,3}|ix|x)\)\s*(.*?)(?=\([ivx]+\)|$)'
                        roman_matches = list(re.finditer(roman_pattern, subpara_text, re.DOTALL))
                        
                        if roman_matches:
                            # Handle nested roman numerals
                            for roman_match in roman_matches:
                                roman_numeral = roman_match.group(1)
                                roman_text = roman_match.group(2).strip()
                                paragraphs.append({
                                    "paragraph": para_num,
                                    "text": f"({subpara_letter}) ({roman_numeral}) {roman_text}"
                                })
                        else:
                            # Regular sub-paragraph
                            paragraphs.append({
                                "paragraph": para_num,
                                "text": f"({subpara_letter}) {subpara_text}"
                            })
            else:
                # If no numbered paragraphs, treat as single paragraph
                paragraphs.append({
                    "paragraph": 1,
                    "text": article_content
                })
            
            # Create article data structure
            article_data = {
                "number": article_num,
                "title": article_title,
                "chapterNumber": chapters[chapter]['number'],
                "chapterTitle": chapters[chapter]['title'],
                "content": paragraphs,
                "amendmentHistory": {},
                "crossReferences": [],
                "notes": f"Article {article_num} of the Maltese Constitution regarding {article_title}."
            }
            
            all_articles_data.append(article_data)
            chapters[chapter]['articles'].append(article_data)
    
    return chapters, all_articles_data

def roman_to_int(s):
    """Convert Roman numeral to integer"""
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    i = 0
    while i < len(s):
        # If this is the subtractive case
        if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
            total += values[s[i + 1]] - values[s[i]]
            i += 2
        # Else this is NOT the subtractive case
        else:
            total += values[s[i]]
            i += 1
    return total

def save_articles_to_json(articles_data):
    """Save each article to its respective chapter folder"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    for article in articles_data:
        chapter_num = article['chapterNumber']
        article_num = article['number']
        
        # Handle special chapter numbers like 10A
        chapter_folder = os.path.join(current_dir, f"chapter_{chapter_num}")
        
        # Create chapter directory if it doesn't exist
        os.makedirs(chapter_folder, exist_ok=True)
        
        # Create JSON file for the article
        filename = os.path.join(chapter_folder, f"article_{article_num}.json")
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(article, f, indent=2, ensure_ascii=False)
        
        print(f"Created {filename}")

def main():
    try:
        print("Starting to parse the Maltese Constitution...")
        chapters, articles_data = extract_articles_from_txt()
        print(f"Found {len(articles_data)} articles across {len(chapters)} chapters.")
        save_articles_to_json(articles_data)
        print(f"Successfully generated JSON files for {len(articles_data)} articles.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 