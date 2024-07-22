// const Filter = require("bad-words");

// class FilterHacked extends Filter {
//   cleanHacked(string) {
//     try {
//       return this.clean(string);
//     } catch (error) {
//       const joinMatch = this.splitRegex.exec(string);
//       const joinString = (joinMatch && joinMatch[0]) || "";
//       return string
//         .split(this.splitRegex)
//         .map((word) => {
//           return this.isProfane(word) ? this.replaceWord(word) : word;
//         })
//         .join(joinString);
//     }
//   }
// }

// module.exports = FilterHacked;

// filename: bad-words-hacked.js
const Filter = require("bad-words");

class FilterHacked extends Filter {
  cleanHacked(string) {
    try {
      // Check if the string contains only emojis
      const isOnlyEmoji =
        string.replace(/[\p{Emoji_Presentation}]/gu, "").trim().length === 0;
      console.log(isOnlyEmoji, string, typeof string, "------>");
      if (isOnlyEmoji) {
        return string; // Return the original string if it is only emojis
      }
      try {
        return this.clean(string);
      } catch (e) {
        return string;
      }
    } catch (error) {
      const joinMatch = this.splitRegex.exec(string);
      const joinString = (joinMatch && joinMatch[0]) || "";
      return string
        .split(this.splitRegex)
        .map((word) => {
          const containsNonEmoji =
            word.replace(/[\p{Emoji_Presentation}]/gu, "").trim().length > 0;
          return containsNonEmoji && this.isProfane(word)
            ? this.replaceWord(word)
            : word;
        })
        .join(joinString);
    }
  }
}

module.exports = FilterHacked;
