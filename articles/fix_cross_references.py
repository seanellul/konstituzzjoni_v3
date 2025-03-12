import os
import json
import glob
import re

def create_article_to_chapter_mapping():
    """Create a mapping of article numbers to their chapter numbers from constitution_toc.json"""
    with open('./articles/constitution_toc.json', 'r', encoding='utf-8') as f:
        toc = json.load(f)
    
    article_to_chapter = {}
    chapter_dict = toc["Constitution of Malta"]
    
    for chapter_title, chapter_content in chapter_dict.items():
        # Extract chapter number from title (e.g., "Chapter I - The Republic of Malta" -> "1")
        chapter_match = re.match(r'Chapter\s+([IVXLCDM]+[A]?)\s+-', chapter_title)
        if not chapter_match:
            continue
            
        roman_numeral = chapter_match.group(1)
        
        # Convert Roman numeral to integer or handle special case like XA
        if 'A' in roman_numeral:
            base_numeral = roman_numeral.replace('A', '')
            chapter_num = roman_to_int(base_numeral)
            chapter_id = f"{chapter_num}A" if roman_numeral.endswith('A') else str(chapter_num)
        else:
            chapter_id = str(roman_to_int(roman_numeral))
        
        # Check if this chapter has parts
        has_parts = False
        for key in chapter_content:
            if key.startswith("Part"):
                has_parts = True
                break
        
        if has_parts:
            # For chapters with parts (like Chapter VI)
            for part_title, part_content in chapter_content.items():
                if isinstance(part_content, dict):
                    for article_num, article_title in part_content.items():
                        article_to_chapter[article_num] = {
                            "chapterNumber": chapter_id,
                            "title": article_title
                        }
        else:
            # For regular chapters
            for article_num, article_title in chapter_content.items():
                article_to_chapter[article_num] = {
                    "chapterNumber": chapter_id,
                    "title": article_title
                }
    
    return article_to_chapter

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

def update_cross_references(article_to_chapter):
    """Update all article JSON files with proper cross-references"""
    # Find all article JSON files in all chapter directories
    article_files = []
    chapter_dirs = glob.glob('chapter_*')
    
    for chapter_dir in chapter_dirs:
        json_files = glob.glob(os.path.join(chapter_dir, 'article_*.json'))
        article_files.extend(json_files)
    
    print(f"Found {len(article_files)} article files to update")
    
    updates_count = 0
    
    for file_path in article_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                article_data = json.load(f)
            except json.JSONDecodeError:
                print(f"Error decoding JSON in {file_path}")
                continue
        
        # Check if there are cross-references to update
        if 'crossReferences' in article_data and article_data['crossReferences']:
            updated = False
            
            for ref in article_data['crossReferences']:
                if 'article' in ref:
                    article_num = str(ref['article'])
                    
                    # Update or add chapterNumber
                    if article_num in article_to_chapter:
                        ref['chapterNumber'] = article_to_chapter[article_num]['chapterNumber']
                        
                        # Add or update articleNumber field to ensure it's used by the UI
                        ref['articleNumber'] = article_num
                        
                        # If title is missing, add it from the TOC
                        if 'title' not in ref or not ref['title']:
                            ref['title'] = article_to_chapter[article_num]['title']
                        
                        updated = True
                    else:
                        # If we can't find the chapter, use a best guess approach
                        try:
                            guess_chapter = guess_chapter_for_article(article_num, article_to_chapter)
                            ref['chapterNumber'] = guess_chapter
                            ref['articleNumber'] = article_num  # Ensure articleNumber is set
                            updated = True
                        except:
                            print(f"Could not determine chapter for article {article_num} in {file_path}")
            
            if updated:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(article_data, f, indent=2, ensure_ascii=False)
                updates_count += 1
                print(f"Updated {file_path}")
    
    print(f"Updated cross-references in {updates_count} files")

def guess_chapter_for_article(article_num, article_to_chapter):
    """Try to guess which chapter an article belongs to if not found in TOC"""
    try:
        article_int = int(article_num.replace('A', ''))
        
        # Find the closest article number
        closest_diff = float('inf')
        closest_article = None
        
        for known_article in article_to_chapter:
            try:
                known_int = int(known_article.replace('A', ''))
                diff = abs(article_int - known_int)
                
                if diff < closest_diff:
                    closest_diff = diff
                    closest_article = known_article
            except ValueError:
                continue
        
        if closest_article and closest_diff <= 5:  # Assume articles within 5 positions are in the same chapter
            return article_to_chapter[closest_article]['chapterNumber']
    except ValueError:
        pass
    
    # Default to chapter 11 (miscellaneous) if we can't make a good guess
    return "11"

def fix_article_48():
    """Specifically fix article_48.json as an example"""
    article_path = os.path.join('chapter_5', 'article_48.json')
    
    try:
        with open(article_path, 'r', encoding='utf-8') as f:
            article_data = json.load(f)
        
        # Update cross-references with proper information
        if 'crossReferences' in article_data:
            for ref in article_data['crossReferences']:
                if ref['article'] == 109:
                    ref['chapterNumber'] = "10"
                    ref['articleNumber'] = "109"  # Ensure articleNumber is set
                elif ref['article'] == 118:
                    ref['chapterNumber'] = "11"
                    ref['articleNumber'] = "118"  # Ensure articleNumber is set
                elif ref['article'] == 120:
                    ref['chapterNumber'] = "11"
                    ref['articleNumber'] = "120"  # Ensure articleNumber is set
        
        with open(article_path, 'w', encoding='utf-8') as f:
            json.dump(article_data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully fixed {article_path}")
    except Exception as e:
        print(f"Error fixing article_48.json: {e}")

def main():
    try:
        print("Creating article to chapter mapping...")
        article_to_chapter = create_article_to_chapter_mapping()
        print(f"Found {len(article_to_chapter)} articles in the table of contents")
        
        print("\nUpdating cross-references in all article files...")
        update_cross_references(article_to_chapter)
        
        print("\nSpecifically fixing article_48.json...")
        fix_article_48()
        
        print("\nDone! All cross-references should now include chapter and article information.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 