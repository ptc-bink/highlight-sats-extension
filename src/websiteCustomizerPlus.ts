import { Configs, configStorage, PageStyle } from './shared/storage';
import * as Util from './shared/utils';
import './websiteCustomizerPlus.css';

// Define the highlighting style
const palindromehighlightStyle = 'background-color: yellow; color: black; font-weight: bold;';
const blackhighlightStyle = 'background-color: red; color: black; font-weight: bold;';

// DOM changin check flag
let flag = false;

const updateDom = (): void => {
  configStorage.get((configs) => {
    if (configs) {
      console.log("update dom ===================");

      const updatedPageStyle: PageStyle = configs.pageStyle.find((config) => config.url === Util.getHostName(document.URL))!;
      const pageStyleIndex = configs.pageStyle.findIndex((config) => config.url === Util.getHostName(document.URL))!;
      if (updatedPageStyle) {

        console.log('updatedPageStyle.enableSetting :>> ', updatedPageStyle.enableSetting);
        console.log('updatedPageStyle.palindromeSats :>> ', updatedPageStyle.palindromeSats);
        console.log('updatedPageStyle.blackSats :>> ', updatedPageStyle.blackSats);

        if (!updatedPageStyle.enableSetting) {
          configs.pageStyle[pageStyleIndex].blackSats = false;
          configs.pageStyle[pageStyleIndex].palindromeSats = false;
          configStorage.set(configs);
          removeHighlightPalindromPrimeNumbers(document.body);
          removeHighlightBlackPrimeNumbers(document.body);
          return;
        }

        if (configs.pageStyle[pageStyleIndex].palindromeSats) {
          highlightPalindromPrimeNumbers(document.body);
        } else removeHighlightPalindromPrimeNumbers(document.body)

        if (configs.pageStyle[pageStyleIndex].blackSats) {
          highlightBlackPrimeNumbers(document.body);
        } else removeHighlightBlackPrimeNumbers(document.body)

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

        console.log('pageStyle.enableSetting :>> ', pageStyle.enableSetting);
        console.log('pageStyle.palindromeSats :>> ', pageStyle.palindromeSats);
        console.log('pageStyle.blackSats :>> ', pageStyle.blackSats);

        if (!pageStyle.enableSetting) {
          removeHighlightPalindromPrimeNumbers(document.body)
          removeHighlightBlackPrimeNumbers(document.body)
          return;
        }

        if (configs.pageStyle[pageStyleIndex].palindromeSats) {
          highlightPalindromPrimeNumbers(document.body);
        } else removeHighlightPalindromPrimeNumbers(document.body)

        if (configs.pageStyle[pageStyleIndex].blackSats) {
          highlightBlackPrimeNumbers(document.body);
        } else removeHighlightBlackPrimeNumbers(document.body)

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

// Function to check if the last 5 digits are 99999
function hasLastFiveDigit99999(num: number) {
  // convert the number to a string
  const numStr = num.toString();

  // get the last characters from the string
  const lastFiveDigits = numStr.slice(-5);

  // check if the last 5 digits are 99999
  return lastFiveDigits === '99999';
}

// Function to check if a number is prime
function isPrime(num: number) {
  if (num <= 1) return false; // 0 and 1 are not prime numbers
  if (num <= 3) return true;  // 2 and 3 are prime numbers

  if (num % 2 === 0 || num % 3 === 0) return false; // Exclude multiples of 2 and 3

  for (let i = 5; i * i <= num; i += 6) { // Check factors up to the square root of the number
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true; // If no factors are found, the number is prime
}

// Function to check if a number is a palindrome prime
function isPalindromePrime(num: number) {
  return isPalindrome(num) && isPrime(num);
  // return isPalindrome(num);
}

// Function to check if a number of digit is from 11 to 16
function isProperDigits(num: number) {
  const numStr = num.toString();
  return numStr.length > 10 && numStr.length < 17;
}

// Function to check if a number is black sats
function isBlackPrime(num: number) {
  return isProperDigits(num) && hasLastFiveDigit99999(num) && isPrime(num);
}

// Highlight all palindrome prime numbers on the webpage
function highlightPalindromPrimeNumbers(node: any) {
  if (node.nodeType === 3) { // Text node
    const text = node.textContent;
    const newHTML = text.replace(/\b\d+\b/g, function (match: any) {
      const num = parseInt(match);
      if (isProperDigits(num) && isPalindromePrime(num)) {
        return `<span style="${palindromehighlightStyle}">${match}</span>`;
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
      if (child.nodeType === 1 && child.tagName === 'SPAN' && child.style && child.style.cssText === palindromehighlightStyle) {
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

// Highlight all palindrome prime numbers on the webpage
function highlightBlackPrimeNumbers(node: any) {
  if (node.nodeType === 3) { // Text node
    const text = node.textContent;
    const newHTML = text.replace(/\b\d+\b/g, function (match: any) {
      const num = parseInt(match);
      if (isBlackPrime(num)) {
        return `<span style="${blackhighlightStyle}">${match}</span>`;
      }
      return match;
    });
    const newNode = document.createElement('span');
    newNode.innerHTML = newHTML;
    node.parentNode.replaceChild(newNode, node);
  } else if (node.nodeType === 1 && node.childNodes && !/script|style/i.test(node.tagName)) {
    // Iterate over child nodes and recursively apply the highlight
    for (let i = 0; i < node.childNodes.length; i++) {
      highlightBlackPrimeNumbers(node.childNodes[i]);
    }
  }
}

// Highlight all palindrome prime numbers on the webpage
function removeHighlightBlackPrimeNumbers(node: any) {
  if (node.nodeType === 3) { // Text node
    return
  } else if (node.nodeType === 1 && node.childNodes && !/script|style/i.test(node.tagName)) {
    // Iterate over child nodes and recursively apply the highlight
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === 1 && child.tagName === 'SPAN' && child.style && child.style.cssText === blackhighlightStyle) {
        // Replace the <span> element with its text content
        const textNode = document.createTextNode(child.textContent);
        child.parentNode.replaceChild(textNode, child);
        i--; // Adjust index to account for the removed node
      } else {
        // Recursively process child nodes
        removeHighlightBlackPrimeNumbers(child);
      }
    }
  }
}

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList: any, observer: any) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    }
    else if (mutation.type === 'attributes') {
      console.log(mutation.attributeName);

      if (mutation.attributeName === 'src') {
        flag = true;
      }

      if (mutation.attributeName !== 'src' && flag == true) {
        updateDom();
        flag = false;
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document.body, config);

// You can stop observing later if needed by calling:
// observer.disconnect();

refresh();
configStorage.listen(updateDom);