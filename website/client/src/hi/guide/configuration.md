# कॉन्फिगरेशन

Repomix को `repomix.config.json` फाइल के माध्यम से कॉन्फिगर किया जा सकता है। यह फाइल आपको अपने प्रोजेक्ट के लिए डिफॉल्ट विकल्प सेट करने की अनुमति देती है।

## कॉन्फिगरेशन फाइल बनाना

आप निम्न कमांड के साथ एक डिफॉल्ट कॉन्फिगरेशन फाइल बना सकते हैं:

```bash
repomix --init
```

यह आपके वर्तमान डायरेक्टरी में एक `repomix.config.json` फाइल बनाएगा।

## कॉन्फिगरेशन विकल्प

`repomix.config.json` फाइल में निम्नलिखित विकल्प शामिल हो सकते हैं:

```json
{
  "include": ["src/**/*.ts", "**/*.md"],
  "ignore": ["**/node_modules/**", "**/*.test.ts"],
  "output": {
    "style": "xml",
    "file": "repomix-output.xml"
  },
  "processing": {
    "removeComments": false,
    "compress": false,
    "truncateBase64": false
  },
  "security": {
    "check": true
  },
  "tokenCounter": "gpt-4"
}
```

### फिल्टरिंग विकल्प

#### `include`

शामिल करने के लिए [ग्लोब पैटर्न](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax) की एक सूची। यदि निर्दिष्ट नहीं है, तो सभी फाइलें शामिल की जाएंगी (कुछ डिफॉल्ट अपवादों के साथ)।

```json
{
  "include": ["src/**/*.ts", "**/*.md"]
}
```

#### `ignore`

बाहर रखने के लिए [ग्लोब पैटर्न](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax) की एक सूची। यह `include` पैटर्न के बाद लागू होता है।

```json
{
  "ignore": ["**/node_modules/**", "**/*.test.ts"]
}
```

### आउटपुट विकल्प

#### `output.style`

आउटपुट फॉर्मेट निर्दिष्ट करता है। विकल्प: `xml`, `markdown`, या `plain`। डिफॉल्ट: `xml`

```json
{
  "output": {
    "style": "markdown"
  }
}
```

#### `output.file`

आउटपुट फाइल का नाम निर्दिष्ट करता है। डिफॉल्ट: `repomix-output.xml`, `repomix-output.md`, या `repomix-output.txt` (चुने गए स्टाइल के आधार पर)

```json
{
  "output": {
    "file": "docs/codebase.md"
  }
}
```

### प्रोसेसिंग विकल्प

#### `processing.removeComments`

यदि `true` है, तो आउटपुट से कोड टिप्पणियां हटा दी जाएंगी। डिफॉल्ट: `false`

```json
{
  "processing": {
    "removeComments": true
  }
}
```

#### `processing.compress`

यदि `true` है, तो कोड को संक्षिप्त किया जाएगा, जिससे टोकन उपयोग कम हो जाएगा। डिफॉल्ट: `false`

```json
{
  "processing": {
    "compress": true
  }
}
```

#### `processing.truncateBase64`

यदि `true` है, तो लंबे base64 डेटा स्ट्रिंग्स (जैसे, इमेज) को ट्रंकेट किया जाएगा ताकि टोकन काउंट कम हो सके। डिफॉल्ट: `false`

```json
{
  "processing": {
    "truncateBase64": true
  }
}
```

### सुरक्षा विकल्प

#### `security.check`

यदि `true` है, तो Repomix संवेदनशील जानकारी के लिए फाइलों की जांच करेगा। डिफॉल्ट: `true`

```json
{
  "security": {
    "check": false
  }
}
```

### टोकन काउंटिंग विकल्प

#### `tokenCounter`

टोकन काउंटिंग के लिए उपयोग किए जाने वाले मॉडल को निर्दिष्ट करता है। विकल्प: `gpt-4`, `gpt-3.5-turbo`, `claude`, `llama`, `gemini`। डिफॉल्ट: `gpt-4`

```json
{
  "tokenCounter": "claude"
}
```

## कस्टम कॉन्फिगरेशन फाइल का उपयोग

आप `--config` विकल्प के साथ एक कस्टम कॉन्फिगरेशन फाइल का पथ निर्दिष्ट कर सकते हैं:

```bash
repomix --config ./configs/my-repomix-config.json
```

## कमांड लाइन विकल्प और कॉन्फिगरेशन फाइल

कमांड लाइन विकल्प कॉन्फिगरेशन फाइल में निर्दिष्ट विकल्पों को ओवरराइड करते हैं। उदाहरण के लिए, यदि आपकी कॉन्फिगरेशन फाइल में `"style": "xml"` है, लेकिन आप `--style markdown` कमांड लाइन विकल्प का उपयोग करते हैं, तो आउटपुट मार्कडाउन फॉर्मेट में होगा।

## कॉन्फिगरेशन उदाहरण

### बुनियादी कॉन्फिगरेशन

```json
{
  "include": ["src/**/*.ts", "**/*.md"],
  "ignore": ["**/node_modules/**", "**/*.test.ts"],
  "output": {
    "style": "markdown",
    "file": "docs/codebase.md"
  }
}
```

### टोकन उपयोग को कम करने के लिए कॉन्फिगरेशन

```json
{
  "processing": {
    "removeComments": true,
    "compress": true
  },
  "tokenCounter": "gpt-4"
}
```

### विकास प्रोजेक्ट के लिए कॉन्फिगरेशन

```json
{
  "include": ["src/**/*.ts"],
  "ignore": ["**/*.test.ts", "**/dist/**"],
  "output": {
    "style": "xml",
    "file": "docs/api-reference.xml"
  },
  "processing": {
    "removeComments": false,
    "compress": false
  }
}
```

### दस्तावेज़ीकरण प्रोजेक्ट के लिए कॉन्फिगरेशन

```json
{
  "include": ["**/*.md", "docs/**/*"],
  "ignore": ["**/node_modules/**"],
  "output": {
    "style": "markdown",
    "file": "docs/documentation.md"
  }
}
```

## अगला क्या है?

- [कमांड लाइन विकल्पों](command-line-options.md) के बारे में अधिक जानें
- [आउटपुट फॉर्मेट](output.md) का अन्वेषण करें
- [कस्टम निर्देशों](custom-instructions.md) के बारे में जानें
