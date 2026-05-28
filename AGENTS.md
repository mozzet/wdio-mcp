# Mobile App Automation Architecture (Direct Execution)

This project is built for automated testing of the **'NoonDate'** app. The **Root CLI (Orchestrator)** is the sole agent responsible for both test orchestration and direct device manipulation.

## 0. App Information

- **Android package**: `com.NoonDate`, `com.NoonDate.debug`
- **iOS bundleId**: `com.mozzet.fbting`

## 1. Execution Model: Root CLI (Direct Execution)

- **End-to-End Responsibility:** The Root CLI performs everything from session initialization, scenario execution (setup, steps, teardown), to final reporting without delegating to sub-agents.
- **Step-by-Step Execution Mandate (CRITICAL):** Every step defined in the scenario YAML is a **mandatory physical checkpoint**. The Orchestrator MUST NOT arbitrarily skip or assume a step is "implicit" or "optional" based on UI observations. If a step's expected UI state is missing, it MUST be explicitly handled and logged according to the `verification.md` policy before proceeding to the next step.
- **Direct Device Manipulation:** All UI interactions (clicks, typing, scrolling, swiping, etc.) are executed directly by the Root CLI using `wdio-mcp` tools.
- **Session Lifecycle Management:** Calls `mcp_wdio-mcp_start_session` to initialize and `mcp_wdio-mcp_close_session` to terminate.
- **Final Result Reporting:** Generates the final report (`report.md`) using the `mobile-test-report` skill based on the execution data registered in the Context Window.
- **Scenario Summary Output (Mandatory):** Immediately after reading the scenario YAML file, the Orchestrator MUST output a summary of the scenario to provide visibility into the test flow. The summary should be formatted as follows:
  ```markdown
  [SCENARIO_SUMMARY]
  - 시나리오명: {displayName}
  - 목적: {description}
  - 총 스텝 수: {N}개
  - 주요 흐름:
    1. {Step 1 Name}
    2. {Step 2 Name}
    ...
  ```

## 2. Technical Reference Guide

Detailed technical methodologies and enforcement policies are automatically injected into the context from the following modular documents. All agents MUST strictly adhere to these guidelines.

@./manipulation.md
@./verification.md
@./artifacts.md
@./session.md
@./output_format.md

## 3. Specialized Skills

The following skills provide specialized logic and expert procedural guidance for specific scenarios:

- **`appium-session` Skill**: Guidelines for session establishment and recovery.
- **`app-version-inspector` Skill**: Queries the installed app version on Android or iOS devices.
- **`ios-numeric-keypad-mastery` Skill**: Specialized logic for iOS numeric input.
- **`wheel-picker-mastery` Skill**: Logic for Android/iOS wheel picker manipulation.
- **`scenario-validator` Skill**: Syntax and logical validation for YAML scenarios.
- **`mobile-test-report` Skill**: Standardized Markdown report generation.
- **`scenario-generator` Skill**: Natural language to YAML scenario conversion.
