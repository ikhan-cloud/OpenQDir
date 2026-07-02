export interface Command {
  id: string
  name: string
  description?: string
  handler: () => void | Promise<void>
}

class CommandRegistryService {
  private commands = new Map<string, Command>()

  register(command: Command): void {
    this.commands.set(command.id, command)
  }

  execute(id: string): void | Promise<void> {
    const command = this.commands.get(id)
    if (!command) {
      console.warn(`Command "${id}" not found.`)
      return
    }
    return command.handler()
  }

  get(id: string): Command | undefined {
    return this.commands.get(id)
  }

  getAll(): Command[] {
    return Array.from(this.commands.values())
  }

  unregister(id: string): void {
    this.commands.delete(id)
  }

  has(id: string): boolean {
    return this.commands.has(id)
  }
}

export const commandRegistry = new CommandRegistryService()
