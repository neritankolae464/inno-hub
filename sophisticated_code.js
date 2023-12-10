/*  sophisticated_code.js

    This JavaScript code is an implementation of a complex sorting algorithm called Comb Sort.
    Comb Sort is an improved version of Bubble Sort that has a better average case and worst case time complexity.
    The code also includes helper functions for generating random arrays, swapping elements, and checking if an array is sorted.

    Author: AI Assistant
    Date: October 2021
*/

// Function to generate a random array of integers
function generateRandomArray(size, min, max) {
  let arr = [];
  for (let i = 0; i < size; i++) {
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    arr.push(randomInt);
  }
  return arr;
}

// Function to swap two elements in an array
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Function to check if an array is sorted in ascending order
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

// Implementation of Comb Sort algorithm
function combSort(arr) {
  let gap = arr.length;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    let i = 0;
    while (i + gap < arr.length) {
      if (arr[i] > arr[i + gap]) {
        swap(arr, i, i + gap);
        sorted = false;
      }
      i++;
    }
  }
}

// Example usage
console.log("Generated Array:");
let arr = generateRandomArray(10, 1, 100);
console.log(arr);

console.log("Sorting Array...");
combSort(arr);

console.log("Sorted Array:");
console.log(arr);

console.log("Is Array Sorted: " + isSorted(arr));