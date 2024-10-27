export function stringCapitalize(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.slice(1);;
}