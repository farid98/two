import { writable } from 'svelte/store';

export const selectedAnswer = writable(0);
export const selectedAnswerCorrect = writable(false);

