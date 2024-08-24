import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css';

// Define the highlighting style
const highlightStyle = 'background-color: yellow; color: black; font-weight: bold;';

const updateDom = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      const updatedPageStyle: PageStyle = configs.pageStyle.find((config) => config.url === Util.getHostName(document.URL))!;
      const pageStyleIndex = configs.pageStyle.findIndex((config) => config.url === Util.getHostName(document.URL))!;
      if (updatedPageStyle) {
        if (!updatedPageStyle.enableSetting) {
          configs.pageStyle[pageStyleIndex].blackSats = false;
          configs.pageStyle[pageStyleIndex].palindromeSats = false;
          configStorage.set(configs);
          removeHighlightPalindromPrimeNumbers(document.body)
          return;
        }

        if (configs.pageStyle[pageStyleIndex].palindromeSats) {
          highlightPalindromPrimeNumbers(document.body);
        } else removeHighlightPalindromPrimeNumbers(document.body)

        if (configs.pageStyle[pageStyleIndex].blackSats
        ) {
          console.log("Black sats");
        }
      }
    }
  });
};

const refresh = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      const pageStyle: PageStyle = configs.pageStyle.find((config) => config.url === Util.getHostName(document.URL))!;
      const pageStyleIndex = configs.pageStyle.findIndex((config) => config.url === Util.getHostName(document.URL))!;

      if (pageStyle) {
        if (!pageStyle.enableSetting) {
          removeHighlightPalindromPrimeNumbers(document.body)
          return;
        }

        if (configs.pageStyle[pageStyleIndex].palindromeSats) {
          highlightPalindromPrimeNumbers(document.body);
        } else removeHighlightPalindromPrimeNumbers(document.body)

        if (configs.pageStyle[pageStyleIndex].blackSats
        ) {
          console.log("Black sats");
        }
      }
    }
  });
};

// Function to check if a number is palindrome
function isPalindrome(num: number) {
  // Convert the number to a string
  let str = num.toString();

  // Reverse the string and compare it with the original string
  return str === str.split('').reverse().join('');
}

// Function to check if a number is prime
function isPrime(num: number) {
  if (num <= 1) return false; // 1 and less are not prime numbers
  if (num === 2) return true; // 2 is the only even prime number

  // Check divisibility from 2 up to the square root of the number
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

// Function to check if a number is a palindrome prime
function isPalindromePrime(num: number) {
  return isPalindrome(num) && isPrime(num);
  // return true
}

// Function to check if a number of digit is from 11 to 15
function isProperDigits(num: number) {
  const numStr = num.toString();
  return numStr.length > 10 && numStr.length < 16;
  // return numStr.length > 1 && numStr.length < 16;
}

// Highlight all palindrome prime numbers on the webpage
function highlightPalindromPrimeNumbers(node: any) {
  if (node.nodeType === 3) { // Text node
    const text = node.textContent;
    const newHTML = text.replace(/\b\d+\b/g, function (match: any) {
      const num = parseInt(match);
      if (isProperDigits(num) && isPalindromePrime(num)) {
        return `<span style="${highlightStyle}">${match}</span>`;
      }
      return match;
    });
    const newNode = document.createElement('span');
    newNode.innerHTML = newHTML;
    node.parentNode.replaceChild(newNode, node);
  } else if (node.nodeType === 1 && node.childNodes && !/script|style/i.test(node.tagName)) {
    // Iterate over child nodes and recursively apply the highlight
    for (let i = 0; i < node.childNodes.length; i++) {
      highlightPalindromPrimeNumbers(node.childNodes[i]);
    }
  }
}

// Highlight all palindrome prime numbers on the webpage
function removeHighlightPalindromPrimeNumbers(node: any) {
  if (node.nodeType === 3) { // Text node
    return
  } else if (node.nodeType === 1 && node.childNodes && !/script|style/i.test(node.tagName)) {
    // Iterate over child nodes and recursively apply the highlight
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === 1 && child.tagName === 'SPAN' && child.style && child.style.cssText === highlightStyle) {
        // Replace the <span> element with its text content
        const textNode = document.createTextNode(child.textContent);
        child.parentNode.replaceChild(textNode, child);
        i--; // Adjust index to account for the removed node
      } else {
        // Recursively process child nodes
        removeHighlightPalindromPrimeNumbers(child);
      }
    }
  }
}

refresh();
configStorage.listen(updateDom);