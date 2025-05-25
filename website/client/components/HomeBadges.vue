<template>
  <div class="home-badges">
    <a href="https://www.npmjs.com/package/repomix" target="_blank" rel="noopener noreferrer">
      <img
        src="https://img.shields.io/npm/v/repomix.svg?maxAge=1000"
        alt="npm version"
      />
    </a>
    <a href="https://www.npmjs.com/package/repomix" target="_blank" rel="noopener noreferrer">
      <img
        src="https://img.shields.io/npm/d18m/repomix"
        alt="npm downloads"
      />
    </a>
    <a href="https://codecov.io/github/yamadashy/repomix" target="_blank" rel="noopener noreferrer">
      <img
        src="https://codecov.io/github/yamadashy/repomix/graph/badge.svg"
        alt="codecov"
      />
    </a>
    <a href="https://discord.gg/wNYzTwZFku" target="_blank" rel="noopener noreferrer">
      <img
        src="https://badgen.net/discord/online-members/wNYzTwZFku?icon=discord&label=discord"
        alt="Discord"
      />
    </a>
    <a href="https://github.com/sponsors/yamadashy" target="_blank" rel="noopener noreferrer">
      <img
        src="https://img.shields.io/github/sponsors/yamadashy?logo=github"
        alt="Sponsors"
      />
    </a>
    <a href="https://github.com/yamadashy/repomix/stargazers" target="_blank" rel="noopener noreferrer">
      <img
        src="https://img.shields.io/github/stars/yamadashy/repomix?style=flat&logo=github"
        alt="GitHub stars"
      />
    </a>
  </div>
</template>

<style scoped>
.home-badges {
  margin-top: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.home-badges img {
  display: inline-block;
}

.home-badges a {
  display: inline-block;
  transition: opacity 0.2s ease;
}

.home-badges a:hover {
  opacity: 0.8;
}
</style>
