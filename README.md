# Magstripe reader for Amex gift cards

Parses magstripes from Amex gift cards, and displays the card number and
expiration date. The card number, when clicked, will copy itself to the
clipboard.

This thing exists to make it easier to convert Amex gift cards into Amazon
credit.

Requires a magstrip reader that emulates a keyboard.

## Acknowledgements

The initial version came from https://gist.github.com/marothstein/5736913
That code knows how to parse normal credit cards, but Amex gift cards are
different for some reason. I pulled out all of the parsing, and replaced it
with a simple version that works only for Amex gift cards. I feel somewhat
bad for not adapting the existing code to read Amex gift cards too, but not
bad enough to do anything about it.
