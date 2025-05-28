# MCP सर्वर

MCP (Merged Code Processor) सर्वर Repomix की कार्यक्षमता को वेब सेवा के रूप में प्रदान करने वाला एक सर्वर कंपोनेंट है। यह आपको Repomix की कार्यक्षमता को वेब एप्लिकेशन या अन्य सेवाओं में एकीकृत करने की अनुमति देता है।

## MCP सर्वर क्या है

MCP सर्वर एक हल्का सर्वर है जो HTTP API के माध्यम से Repomix की कार्यक्षमता प्रदान करता है। यह निम्नलिखित को सक्षम बनाता है:

1. **रिमोट प्रोसेसिंग**: रिमोट सर्वर पर कोडबेस को प्रोसेस करना
2. **वेब इंटीग्रेशन**: Repomix कार्यक्षमता को वेब एप्लिकेशन में एकीकृत करना
3. **ऑटोमेशन**: CI/CD पाइपलाइन या अन्य ऑटोमेशन वर्कफ़्लो में Repomix को शामिल करना

## MCP सर्वर शुरू करना

MCP सर्वर शुरू करने के लिए, निम्न कमांड का उपयोग करें:

```bash
repomix serve
```

डिफॉल्ट रूप से, सर्वर पोर्ट 3000 पर सुनता है। पोर्ट बदलने के लिए:

```bash
repomix serve --port 8080
```

## API एंडपॉइंट्स

MCP सर्वर निम्नलिखित मुख्य एंडपॉइंट्स प्रदान करता है:

### POST /process

रिपॉजिटरी को प्रोसेस करता है और मर्ज किया गया आउटपुट लौटाता है।

**रिक्वेस्ट बॉडी**:

```json
{
  "repositoryUrl": "https://github.com/user/repo",
  "branch": "main",
  "outputStyle": "xml",
  "includePatterns": ["src/**/*.ts"],
  "ignorePatterns": ["**/*.test.ts"],
  "removeComments": false,
  "compress": false
}
```

**रिस्पांस**:

```json
{
  "output": "...",
  "tokenCount": 12345,
  "fileCount": 42
}
```

### GET /health

सर्वर के स्वास्थ्य की जांच करता है।

**रिस्पांस**:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## सुरक्षा

यदि आप MCP सर्वर को सार्वजनिक रूप से एक्सपोज़ कर रहे हैं, तो निम्नलिखित सुरक्षा उपायों पर विचार करें:

1. **प्रमाणीकरण**: API कुंजी या अन्य प्रमाणीकरण तंत्र लागू करें
2. **रेट लिमिटिंग**: अत्यधिक उपयोग को रोकने के लिए रेट लिमिट सेट करें
3. **HTTPS**: हमेशा HTTPS का उपयोग करके संचार को एन्क्रिप्ट करें
4. **एक्सेस कंट्रोल**: आवश्यकतानुसार एक्सेस कंट्रोल लागू करें

## कॉन्फिगरेशन विकल्प

MCP सर्वर निम्नलिखित कॉन्फिगरेशन विकल्पों का समर्थन करता है:

- `--port <number>`: सर्वर द्वारा सुने जाने वाला पोर्ट (डिफॉल्ट: 3000)
- `--host <string>`: सर्वर द्वारा बाइंड किया जाने वाला होस्ट (डिफॉल्ट: localhost)
- `--cors`: CORS सक्षम करें (डिफॉल्ट: false)
- `--cors-origin <string>`: अनुमति प्राप्त CORS मूल (डिफॉल्ट: *)
- `--rate-limit <number>`: प्रति IP प्रति मिनट अनुरोध (डिफॉल्ट: 60)

## क्लाइंट इंटीग्रेशन

MCP सर्वर एक RESTful API प्रदान करता है, इसलिए आप किसी भी HTTP क्लाइंट का उपयोग करके इसे एकीकृत कर सकते हैं।

**cURL उदाहरण**:

```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/user/repo",
    "outputStyle": "xml"
  }'
```

**JavaScript उदाहरण**:

```javascript
fetch('http://localhost:3000/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    repositoryUrl: 'https://github.com/user/repo',
    outputStyle: 'xml'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## अगला क्या है?

- [कमांड लाइन विकल्पों](command-line-options.md) के बारे में अधिक जानें
- [कॉन्फिगरेशन विकल्पों](configuration.md) का अन्वेषण करें
- [GitHub Actions](github-actions.md) के साथ एकीकरण के बारे में जानें
