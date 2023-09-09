<br>
<div align="center">
    <h1>📦 @hexagonal-ui/core</h1>
    <strong>Cross-framework and low-level design system building blocks with a focus on customization, interactions, and accessibility</strong>
</div>
<br>
<br>

## ✨ Features

TODO

<br>

## 🚀 Usage

This section introduces the `hexagonal-ui` essentials by walking through its main commands:

0️⃣ ...
1️⃣ ...
2️⃣ ...
3️⃣ ...

<br>

## 🏗️ Architecture

Two main layers:

-   **Core**: like the Application core in the hexagonal architecture, it centralizes all the core library logic and includes two levels
    -   Elements: Low-level entities modelizing HTML elements (e.g. Accordion, Button, ...)
    -   Patterns: Element aggregates implementing UX patterns (e.g. useButton, useDialog, ... documented in the [WCAG website](https://www.w3.org/WAI/ARIA/apg/patterns/))
-   **Adapters**: Surrounding the core, this layer aims to interact with it to implement framework specificities. There'll be typically one adapter library per UI framework. Each library is a concrete implementation of the different ports/interfaces exposed by the core (eg. ViewModel ports, ...)

<br>

## ✍️ Contribution

We're open to new contributions, you can find more details [here](https://github.com/adbayb/hexagonal-ui/blob/main/CONTRIBUTING.md).

<br>

## 📖 License

[MIT](https://github.com/adbayb/hexagonal-ui/blob/main/LICENSE "License MIT")

<br>
