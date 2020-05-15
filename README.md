# Usage

This will sync the new changed lines from the english text to the other language file.
For example if you added a new line to english.txt with `Apple=` it'll be added to the dutch one.

If you want to override the file you're changing make sure to pass it as argument 2 and 3 like this.
`node sync.js ./english.txt ./dutch.txt ./dutch.txt`.

By default this uses `node sync.js ./base.txt ./translation.txt ./output.txt` if you miss the arguments.


```bash
wget https://raw.githubusercontent.com/limetech/lang-en_US/master/main.txt -O english.txt
wget https://raw.githubusercontent.com/limetech/lang-nl_NL/master/main.txt -O dutch.txt
git clone https://github.com/unraid/translation-manager && cd translation-manager

./bin/sync ./english.txt ./dutch.txt ./output.txt
```