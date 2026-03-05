// Terminal typing animation effect
class TerminalEffect {
    constructor(terminalSelector = '.terminal') {
        this.terminal = document.querySelector(terminalSelector);
        this.blurred = this.terminal?.querySelector('.terminal__blurred');
        this.output = this.terminal?.querySelector('.terminal__output');
        this.firstLine = this.blurred?.querySelector('.terminal__blurred__line:nth-child(1)');
        this.secondLine = this.blurred?.querySelector('.terminal__blurred__line:nth-child(2)');
        this.firstTextfield = this.firstLine?.querySelector('.textfield');
        this.secondTextfield = this.secondLine?.querySelector('.textfield');
        this.firstCaret = this.firstLine?.querySelector('.caret');
        this.secondCaret = this.secondLine?.querySelector('.caret');
        this.charSpeed = 30; // ms per character
        this.isRunning = false; // Flag to control the loop

        // Get commands from data attribute
        const commandsString = this.terminal?.getAttribute('data-commands') || '';
        this.commands = commandsString.split(';').map(cmd => cmd.trim()).filter(cmd => cmd);

        // Set up escape hatches
        this.setupEscapeHatches();
    }

    setupEscapeHatches() {
        // Stop on page visibility change (tab switch, minimize)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            }
        });

        // Stop before page unload
        window.addEventListener('beforeunload', () => {
            this.stop();
        });

        // Stop on navigation (for SPAs)
        window.addEventListener('pagehide', () => {
            this.stop();
        });
    }

    stop() {
        this.isRunning = false;
    }

    async typeText(element, text) {
        return new Promise((resolve) => {
            let index = 0;
            const type = () => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                    setTimeout(type, this.charSpeed);
                } else {
                    resolve();
                }
            };
            type();
        });
    }

    async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async runCommand(command) {
        // Reset the terminal
        this.firstTextfield.textContent = '';
        this.secondTextfield.textContent = '';
        const outputH1 = this.output.querySelector('h1');
        outputH1.textContent = '';

        // Step 1: Type "echo " to terminal only
        await this.typeText(this.firstTextfield, 'echo ');

        // Step 2: Type command simultaneously in both terminal and output
        await Promise.all([
            this.typeText(this.firstTextfield, command),
            this.typeText(outputH1, command)
        ]);

        // Hide first line caret (simulate pressing enter)
        this.firstCaret.style.visibility = 'hidden';

        // Step 3: Wait and then show second prompt line
        this.secondLine.style.visibility = 'visible'; // Show second line
        await this.wait(1500);

        // Step 4: Type "clear" on second line
        await this.typeText(this.secondTextfield, 'clear');

        // Step 5: Wait a bit, then execute clear
        await this.wait(500);

        // Hide second line and clear first line
        this.secondLine.style.visibility = 'hidden'; // Hide second line
        this.firstCaret.style.visibility = 'visible'; // Restore first line caret
        this.firstTextfield.textContent = '';
        outputH1.textContent = '';

        // Wait before next command
        await this.wait(800);
    }

    async run() {
        if (!this.terminal) {
            console.error('Terminal element not found');
            return;
        }

        if (this.commands.length === 0) {
            console.error('No commands found');
            return;
        }

        this.isRunning = true;

        // Loop while running
        while (this.isRunning) {
            // Iterate through all commands
            for (const command of this.commands) {
                if (!this.isRunning) break; // Check before each command
                await this.runCommand(command);
            }
        }
    }
}

// Initialize and run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new TerminalEffect('.terminal');
    terminal.run();
});
