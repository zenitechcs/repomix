# कमांड लाइन विकल्प

## बुनियादी विकल्प
- `-v, --version`: टूल का वर्जन दिखाएं

## आउटपुट विकल्प
- `-o, --output <file>`: आउटपुट फाइल का नाम (डिफॉल्ट: `repomix-output.txt`)
- `--stdout`: फाइल में लिखने के बजाय stdout पर आउटपुट करें (`--output` विकल्प के साथ उपयोग नहीं किया जा सकता)
- `--style <type>`: आउटपुट स्टाइल (`plain`, `xml`, `markdown`) (डिफॉल्ट: `xml`)
- `--parsable-style`: चुनी गई स्टाइल स्कीमा के आधार पर पार्सेबल आउटपुट सक्षम करें (डिफॉल्ट: `false`)
- `--compress`: इंटेलिजेंट कोड एक्सट्रैक्शन करें, आवश्यक फंक्शन और क्लास सिग्नेचर पर ध्यान केंद्रित करते हुए इम्प्लीमेंटेशन विवरण को हटाएं। अधिक विवरण और उदाहरण के लिए, [कोड कम्प्रेशन गाइड](code-compress) देखें।
- `--output-show-line-numbers`: लाइन नंबर जोड़ें (डिफॉल्ट: `false`)
- `--copy`: क्लिपबोर्ड में कॉपी करें (डिफॉल्ट: `false`)
- `--no-file-summary`: फाइल सारांश अक्षम करें (डिफॉल्ट: `true`)
- `--no-directory-structure`: डायरेक्टरी संरचना अक्षम करें (डिफॉल्ट: `true`)
- `--no-files`: फाइलों की सामग्री आउटपुट अक्षम करें (केवल मेटाडेटा मोड) (डिफॉल्ट: `true`)
- `--remove-comments`: टिप्पणियां हटाएं (डिफॉल्ट: `false`)
- `--remove-empty-lines`: खाली लाइनें हटाएं (डिफॉल्ट: `false`)
- `--truncate-base64`: Base64 एन्कोडेड डेटा स्ट्रिंग्स को छोटा करें (डिफॉल्ट: `false`)
- `--header-text <text>`: फाइल हेडर में शामिल करने के लिए कस्टम टेक्स्ट
- `--instruction-file-path <path>`: विस्तृत कस्टम निर्देश वाली फाइल का पथ
- `--include-empty-directories`: आउटपुट में खाली डायरेक्टरी शामिल करें (डिफॉल्ट: `false`)
- `--include-diffs`: आउटपुट में git diffs शामिल करें (वर्क ट्री और स्टेज्ड चेंजेस दोनों को अलग-अलग शामिल करता है) (डिफॉल्ट: `false`)
- `--no-git-sort-by-changes`: git चेंज काउंट के आधार पर फाइलों को सॉर्ट करना अक्षम करें (डिफॉल्ट: `true`)

## फिल्टर विकल्प
- `--include <patterns>`: शामिल करने के पैटर्न (कॉमा-अलग)
- `-i, --ignore <patterns>`: अनदेखा करने के पैटर्न (कॉमा-अलग)
- `--stdin`: फाइलों को स्वचालित रूप से खोजने के बजाय stdin से फाइल पथ पढ़ें
- `--no-gitignore`: .gitignore फाइल उपयोग अक्षम करें
- `--no-default-patterns`: डिफॉल्ट पैटर्न अक्षम करें

## रिमोट रिपॉजिटरी विकल्प
- `--remote <url>`: रिमोट रिपॉजिटरी प्रोसेस करें
- `--remote-branch <name>`: रिमोट ब्रांच नाम, टैग, या कमिट हैश निर्दिष्ट करें (डिफॉल्ट रिपॉजिटरी डिफॉल्ट ब्रांच है)

## कॉन्फ़िगरेशन विकल्प
- `-c, --config <path>`: कस्टम कॉन्फ़िग फाइल पथ
- `--init`: कॉन्फ़िग फाइल बनाएं
- `--global`: ग्लोबल कॉन्फ़िग का उपयोग करें

## सुरक्षा विकल्प
- `--no-security-check`: सुरक्षा जांच अक्षम करें (डिफॉल्ट: `true`)

## टोकन काउंट विकल्प
- `--token-count-encoding <encoding>`: टोकन काउंट एन्कोडिंग निर्दिष्ट करें (जैसे, `o200k_base`, `cl100k_base`) (डिफॉल्ट: `o200k_base`)

## अन्य विकल्प
- `--top-files-len <number>`: दिखाने वाली टॉप फाइलों की संख्या (डिफॉल्ट: `5`)
- `--verbose`: वर्बोस लॉगिंग सक्षम करें
- `--quiet`: stdout पर सभी आउटपुट अक्षम करें

## उदाहरण

```bash
# बुनियादी उपयोग
repomix

# कस्टम आउटपुट
repomix -o output.xml --style xml

# stdout पर आउटपुट
repomix --stdout > custom-output.txt

# stdout पर आउटपुट भेजें, फिर दूसरे कमांड में पाइप करें (उदाहरण के लिए, simonw/llm)
repomix --stdout | llm "कृपया बताएं कि यह कोड क्या करता है।"

# कम्प्रेशन के साथ कस्टम आउटपुट
repomix --compress

# विशिष्ट फाइलों को प्रोसेस करें
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# ब्रांच के साथ रिमोट रिपॉजिटरी
repomix --remote https://github.com/user/repo/tree/main

# कमिट के साथ रिमोट रिपॉजिटरी
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# शॉर्टहैंड के साथ रिमोट रिपॉजिटरी
repomix --remote user/repo

# फाइल लिस्ट के लिए stdin का उपयोग
find src -name "*.ts" -type f | repomix --stdin
git ls-files "*.js" | repomix --stdin
echo -e "src/index.ts\nsrc/utils.ts" | repomix --stdin
```