# .NET App Migration Prompt Template: [Technology X: None detected] to [Technology Y: Azure Service Bus]

## Migration Request

Migrate this codebase from Technology X (detected message-queuing technology) to Azure Service Bus, focusing exclusively on code-level changes required for successful compilation.

Note: Analysis of the repository found no usage of message queuing libraries or APIs (e.g., RabbitMQ, MassTransit, System.Messaging). Therefore, there are no code-level replacements required for Technology X in this repository. This plan documents findings and next-steps if a migration is still desired (for example, if messaging is introduced or other repositories reference a message broker).

## Repository Analysis Summary

- Solution path: `D:\Tetherfi\TetherfiChatApp\`
- Projects discovered:
  - `Tetherfi.Chat.Service` (TargetFramework: net8.0)
  - `Tetherfi.Identity.Service` (TargetFramework: net8.0)
- Scanned for common MQ usages and libraries: `RabbitMQ.Client`, `MassTransit`, `NServiceBus`, `System.Messaging`, `Azure.Messaging.ServiceBus`, `Microsoft.Azure.ServiceBus`, `MessageQueue`, broker clients, queue/subscribe-related APIs.
- Findings: No references or usages of message queuing libraries or queue-related APIs were found in the codebase.

Conclusion: Technology X (the source message-queuing tech) was not found in this codebase. Treat the migration as a no-op for code-level replacements. If the intent is to add or integrate Azure Service Bus functionality, that is a separate feature task and outside the selected migration scope (which prohibits adding new business logic).

## Tools Usage

You MUST use the `#azure_service_bus_knowledge_base` for detailed SDK specs and samples when performing any future code additions or replacements related to Azure Service Bus.

From the knowledge base the recommended packages and versions are:

- `Azure.Messaging.ServiceBus` Version `7.19.0`
- `Azure.Identity` Version `1.14.0`

(If later tasks require installing packages, follow the guidance in the Important Guideline in `progress.md`.)

## Migration Plan (adjusted to repository state)

1. Validate source technology existence (completed) — No Technology X usage detected.
2. If user confirms there is an external dependency or other repositories using Technology X, provide details and link them to this plan for targeted migration.
3. If the user wants to *introduce* Azure Service Bus (not a migration), create a separate feature request. That task is out of scope for this migration.
4. If additional repositories are provided that contain Technology X, run the same analysis and generate per-repo migration tasks.

## Proposed Tasks (only if Technology X is present or user requests integration)

- Add package references to projects that require Azure Service Bus:
  - `Azure.Messaging.ServiceBus` (7.19.0)
  - `Azure.Identity` (1.14.0)
- Add configuration entry `AzureServiceBus:FullyQualifiedNamespace` to `appsettings.json` when wiring Service Bus client.
- Replace Technology X client usage with `ServiceBusClient` and usage patterns from the knowledge base.
- Update dependency management using SDK-style `dotnet add package` (projects are SDK-style .NET 8)
- Build and verify compilation.

These tasks are not executed now because no Technology X references were found.

## Success Criteria

1. All Technology X dependencies and imports are replaced (N/A — none found).
2. All old Technology X code files/configs cleaned from solution (N/A).
3. Codebase compiles successfully with Technology Y (if changes were made).
4. All migration tasks tracked and marked completed.
5. All uncommitted changes are committed if a VCS is detected.

## Next Step

Created migration plan and progress tracker files under `.appmod/.migration/`.

STOP: Please review this plan. Type `Continue` to proceed with migration tasks (if any), or reply with instructions (for example: point me to another repository that contains Technology X or ask to implement Service Bus integration as a separate feature task).