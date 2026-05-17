"""
ASL Text Transformer Service
Converts standard English text to simplified ASL format
"""

import re
import logging
from typing import List, Set

logger = logging.getLogger(__name__)

class ASLTransformer:
    """
    Transforms English text to simplified ASL (American Sign Language) format
    
    ASL transformation rules:
    1. Remove articles (a, an, the)
    2. Remove auxiliary verbs (is, are, was, were, have, has, had, will, would, could, should)
    3. Remove unnecessary prepositions in some contexts
    4. Convert to uppercase
    5. Preserve essential meaning and word order
    """
    
    def __init__(self):
        # Articles to remove
        self.articles: Set[str] = {'a', 'an', 'the'}
        
        # Auxiliary verbs to remove
        self.auxiliary_verbs: Set[str] = {
            'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
            'have', 'has', 'had', 'having',
            'will', 'would', 'shall', 'should', 'could', 'can',
            'may', 'might', 'must', 'ought', 'do', 'does', 'did'
        }
        
        # Common contractions to expand and then process
        self.contractions: dict = {
            "i'm": "i am",
            "you're": "you are",
            "he's": "he is",
            "she's": "she is",
            "it's": "it is",
            "we're": "we are",
            "they're": "they are",
            "isn't": "is not",
            "aren't": "are not",
            "wasn't": "was not",
            "weren't": "were not",
            "haven't": "have not",
            "hasn't": "has not",
            "hadn't": "had not",
            "won't": "will not",
            "wouldn't": "would not",
            "don't": "do not",
            "doesn't": "does not",
            "didn't": "did not",
            "can't": "can not",
            "couldn't": "could not",
            "shouldn't": "should not",
            "mustn't": "must not"
        }
    
    def expand_contractions(self, text: str) -> str:
        """
        Expand contractions in the text
        
        Args:
            text: Input text with potential contractions
            
        Returns:
            Text with contractions expanded
        """
        text_lower = text.lower()
        for contraction, expansion in self.contractions.items():
            text_lower = text_lower.replace(contraction, expansion)
        return text_lower
    
    def remove_articles_and_auxiliaries(self, words: List[str]) -> List[str]:
        """
        Remove articles and auxiliary verbs from word list
        
        Args:
            words: List of words to process
            
        Returns:
            Filtered list of words
        """
        filtered_words = []
        
        for word in words:
            word_clean = word.lower().strip()
            
            # Skip empty words
            if not word_clean:
                continue
                
            # Skip articles and auxiliary verbs
            if word_clean in self.articles or word_clean in self.auxiliary_verbs:
                continue
                
            # Keep the word
            filtered_words.append(word)
        
        return filtered_words
    
    def clean_punctuation(self, text: str) -> str:
        """
        Clean and normalize punctuation
        
        Args:
            text: Input text
            
        Returns:
            Text with cleaned punctuation
        """
        # Replace multiple spaces with single space
        text = re.sub(r'\s+', ' ', text)
        
        # Remove most punctuation except periods, commas, question marks, exclamation marks
        text = re.sub(r'[^\w\s\.\,\?\!]', '', text)
        
        return text.strip()
    
    def transform(self, text: str) -> str:
        """
        Transform English text to simplified ASL format
        
        Args:
            text: Input English text
            
        Returns:
            Transformed ASL text in uppercase
            
        Example:
            Input: "The cat is sitting on the mat"
            Output: "CAT SITTING ON MAT"
        """
        try:
            if not text or not text.strip():
                return ""
            
            # Step 1: Expand contractions
            expanded_text = self.expand_contractions(text)
            
            # Step 2: Clean punctuation
            cleaned_text = self.clean_punctuation(expanded_text)
            
            # Step 3: Split into words
            words = cleaned_text.split()
            
            # Step 4: Remove articles and auxiliary verbs
            filtered_words = self.remove_articles_and_auxiliaries(words)
            
            # Step 5: Join words and convert to uppercase
            asl_text = ' '.join(filtered_words).upper()
            
            # Step 6: Final cleanup
            asl_text = re.sub(r'\s+', ' ', asl_text).strip()
            
            logger.info(f"ASL Transform: '{text}' -> '{asl_text}'")
            
            return asl_text
            
        except Exception as e:
            logger.error(f"Error in ASL transformation: {str(e)}")
            # Return original text in uppercase as fallback
            return text.upper()
    
    def batch_transform(self, texts: List[str]) -> List[str]:
        """
        Transform multiple texts to ASL format
        
        Args:
            texts: List of input texts
            
        Returns:
            List of transformed ASL texts
        """
        return [self.transform(text) for text in texts]