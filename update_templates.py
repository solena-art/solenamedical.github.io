#!/usr/bin/env python3
"""
Template updater for SOLENA website
This script applies consistent templates across all pages of the multilingual website.
"""

import os
import re
import glob
import shutil
from pathlib import Path

# Define the templates and their target locations in the HTML files
TEMPLATES = {
    # Language dropdowns
    "language-dropdown": {
        "en": "templates/language-dropdown-en.html",
        "ko": "templates/language-dropdown-ko.html",
        "ja": "templates/language-dropdown-ja.html",
        "de": "templates/language-dropdown-de.html",
        "pattern": r'<!-- Language Selector -->.*?</div>\s*</div>',
        "flags": re.DOTALL
    },
    # Logo
    "logo": {
        "template": "templates/logo.html",
        "pattern": r'<a class="navbar-brand".*?</a>\s*',
        "flags": re.DOTALL
    },
    # Navigation
    "nav": {
        "en": "templates/nav-en.html",
        "ko": "templates/nav-ko.html",
        "ja": "templates/nav-ja.html",
        "de": "templates/nav-de.html",
        "pattern": r'<ul class="navbar-nav ms-auto">.*?</ul>\s*',
        "flags": re.DOTALL
    }
}

# Map language codes to folder paths
LANG_PATHS = {
    "en": "",
    "ko": "ko/",
    "ja": "ja/",
    "de": "de/"
}

def read_template(template_path):
    """Read a template file and return its contents"""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: Template file not found: {template_path}")
        return None
    except Exception as e:
        print(f"Error reading template {template_path}: {e}")
        return None

def process_file(filepath, lang):
    """Process a single HTML file and apply templates"""
    print(f"Processing {filepath}...")
    
    try:
        # Check if file exists and is a regular file
        if not os.path.isfile(filepath):
            print(f"  Skipping {filepath} - not a regular file")
            return False
            
        # Create backup of the original file
        backup_path = f"{filepath}.bak"
        try:
            shutil.copy2(filepath, backup_path)
        except Exception as e:
            print(f"  Warning: Could not create backup of {filepath}: {e}")
        
        # Read the file content
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine root path based on file location
        rel_path = os.path.relpath(filepath, os.getcwd())
        parts = rel_path.split(os.sep)
        root_path = "../" * (len(parts) - 1) if len(parts) > 1 else ""
        
        # Apply language dropdown template
        if "language-dropdown" in TEMPLATES:
            template_info = TEMPLATES["language-dropdown"]
            if lang in template_info:
                template_content = read_template(template_info[lang])
                if template_content:
                    # Replace placeholders
                    template_content = template_content.replace("{{root_path}}", root_path)
                    # Replace in content
                    pattern = template_info["pattern"]
                    flags = template_info.get("flags", 0)
                    content = re.sub(pattern, template_content, content, flags=flags)
        
        # Apply logo template
        if "logo" in TEMPLATES:
            template_info = TEMPLATES["logo"]
            template_content = read_template(template_info["template"])
            if template_content:
                # Replace placeholders
                template_content = template_content.replace("{{root_path}}", root_path)
                template_content = template_content.replace("{{lang_path}}", LANG_PATHS[lang])
                # Replace in content
                pattern = template_info["pattern"]
                flags = template_info.get("flags", 0)
                content = re.sub(pattern, template_content, content, flags=flags)
        
        # Apply navigation template
        if "nav" in TEMPLATES:
            template_info = TEMPLATES["nav"]
            if lang in template_info:
                template_content = read_template(template_info[lang])
                if template_content:
                    # Replace placeholders
                    template_content = template_content.replace("{{root_path}}", root_path)
                    template_content = template_content.replace("{{lang_path}}", LANG_PATHS[lang])
                    # Replace in content
                    pattern = template_info["pattern"]
                    flags = template_info.get("flags", 0)
                    content = re.sub(pattern, template_content, content, flags=flags)
        
        # Write back the updated content
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Updated {filepath}")
            return True
        except PermissionError:
            print(f"  Error: Permission denied when writing to {filepath}")
            return False
        except Exception as e:
            print(f"  Error writing to {filepath}: {e}")
            return False
            
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")
        return False

def process_all_files():
    """Process all HTML files in the project"""
    success_count = 0
    failure_count = 0
    
    # Process English files
    for html_file in glob.glob("*.html"):
        if process_file(html_file, "en"):
            success_count += 1
        else:
            failure_count += 1
    
    # Process Korean files
    for html_file in glob.glob("ko/*.html"):
        if process_file(html_file, "ko"):
            success_count += 1
        else:
            failure_count += 1
    
    # Process Japanese files
    for html_file in glob.glob("ja/*.html"):
        if process_file(html_file, "ja"):
            success_count += 1
        else:
            failure_count += 1
    
    # Process German files
    for html_file in glob.glob("de/*.html"):
        if process_file(html_file, "de"):
            success_count += 1
        else:
            failure_count += 1
            
    return success_count, failure_count

def main():
    """Main function"""
    print("Starting template update process...")
    
    # Verify template directory exists
    if not os.path.isdir("templates"):
        print("Error: templates directory not found. Please create the templates directory first.")
        return
        
    # Verify template files exist
    missing_templates = []
    for template_key, template_info in TEMPLATES.items():
        if "template" in template_info:
            if not os.path.isfile(template_info["template"]):
                missing_templates.append(template_info["template"])
        else:
            for lang, template_path in template_info.items():
                if lang != "pattern" and lang != "flags" and not os.path.isfile(template_path):
                    missing_templates.append(template_path)
    
    if missing_templates:
        print("Warning: The following template files are missing:")
        for template in missing_templates:
            print(f"  - {template}")
        print("Some template replacements may not be applied.")
        
    # Process all files
    success_count, failure_count = process_all_files()
    
    print(f"\nTemplate update complete!")
    print(f"Successfully updated: {success_count} files")
    if failure_count > 0:
        print(f"Failed to update: {failure_count} files")

if __name__ == "__main__":
    main() 