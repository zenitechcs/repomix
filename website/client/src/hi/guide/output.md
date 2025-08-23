# आउटपुट फॉर्मेट

Repomix तीन आउटपुट फॉर्मेट का समर्थन करता है:
- XML (डिफ़ॉल्ट)
- मार्कडाउन
- प्लेन टेक्स्ट

## XML फॉर्मेट

```bash
repomix --style xml
```

XML फॉर्मेट AI प्रसंस्करण के लिए अनुकूलित है:

```xml
यह फ़ाइल संपूर्ण कोडबेस का मर्ज किया गया प्रतिनिधित्व है...

<file_summary>
(मेटाडेटा और AI निर्देश)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// फ़ाइल सामग्री यहाँ
</file>
</files>

<git_logs>
<git_log_commit>
<date>2025-08-20 00:47:19 +0900</date>
<message>feat(cli): Add --include-logs option for git commit history</message>
<files>
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts
</files>
</git_log_commit>

<git_log_commit>
<date>2025-08-21 00:09:43 +0900</date>
<message>Merge pull request #795 from yamadashy/chore/ratchet-update-ci</message>
<files>
.github/workflows/ratchet-update.yml
</files>
</git_log_commit>
</git_logs>
```

::: tip XML क्यों?
XML टैग Claude जैसे AI मॉडल को सामग्री को अधिक सटीक रूप से पार्स करने में मदद करते हैं। [Claude डॉक्यूमेंटेशन](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) संरचित प्रॉम्प्ट के लिए XML टैग का उपयोग करने की सिफारिश करता है।
:::

## मार्कडाउन फॉर्मेट

```bash
repomix --style markdown
```

मार्कडाउन पठनीय फॉर्मेटिंग प्रदान करता है:

```markdown
यह फ़ाइल संपूर्ण कोडबेस का मर्ज किया गया प्रतिनिधित्व है...

# फ़ाइल सारांश
(मेटाडेटा और AI निर्देश)

# डायरेक्टरी संरचना
```
src/
index.ts
utils/
helper.ts
```

# फ़ाइलें

## फ़ाइल: src/index.ts
```typescript
// फ़ाइल सामग्री यहाँ
```

# Git Logs
```
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
```

## AI मॉडल के साथ उपयोग

प्रत्येक फॉर्मेट AI मॉडल के साथ अच्छी तरह से काम करता है, लेकिन विचार करें:
- Claude के लिए XML का उपयोग करें (सर्वोत्तम पार्सिंग सटीकता)
- सामान्य पठनीयता के लिए मार्कडाउन का उपयोग करें
- सादगी और सार्वभौमिक संगतता के लिए प्लेन टेक्स्ट का उपयोग करें

## अनुकूलन

`repomix.config.json` में डिफ़ॉल्ट फॉर्मेट सेट करें:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## प्लेन टेक्स्ट फॉर्मेट

```bash
repomix --style plain
```

आउटपुट संरचना:
```text
यह फ़ाइल संपूर्ण कोडबेस का मर्ज किया गया प्रतिनिधित्व है...

================
फ़ाइल सारांश
================
(मेटाडेटा और AI निर्देश)

================
डायरेक्टरी संरचना
================
src/
  index.ts
  utils/
    helper.ts

================
फ़ाइलें
================

================
फ़ाइल: src/index.ts
================
// फ़ाइल सामग्री यहाँ

================
Git Logs
================
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
