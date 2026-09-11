import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from './components/Components/user-profile.component';

@Component({
  selector: 'app-root',
  host: { class: 'jbx-root' },
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [UserProfileComponent, RouterLink, CommonModule]
})
export class AppComponent {
  private readonly apiEndpoint = 'https://northstar-ai-support-chatbot-jctw.onrender.com/api/chat';

  protected openChat(): void {
    const existing = document.getElementById('northstar-ai-concierge');
    if (existing) {
      existing.classList.add('is-open');
      (document.getElementById('northstar-ai-input') as HTMLInputElement | null)?.focus();
      return;
    }

    const panel = document.createElement('aside');
    panel.id = 'northstar-ai-concierge';
    panel.innerHTML = `
      <div class="ns-ai-shell">
        <div class="ns-ai-header">
          <div>
            <span class="ns-ai-kicker">NORTHSTAR / AI CONCIERGE</span>
            <strong>Atelier Stylist</strong>
            <span class="ns-ai-status"><i></i> Online</span>
          </div>
          <button class="ns-ai-close" type="button" aria-label="Close concierge">×</button>
        </div>
        <div class="ns-ai-messages" id="northstar-ai-messages">
          <div class="ns-ai-message assistant">Welcome to Northstar. I’m your AI styling concierge. Ask me about pieces, availability, or what might suit your look.</div>
        </div>
        <div class="ns-ai-suggestions">
          <button type="button" data-prompt="What luxury jackets are currently available?">Available jackets</button>
          <button type="button" data-prompt="Tell me about the Sovereign Shearling Trench.">Sovereign Trench</button>
        </div>
        <form class="ns-ai-form" id="northstar-ai-form">
          <input id="northstar-ai-input" autocomplete="off" placeholder="Ask your concierge…" maxlength="2000" />
          <button type="submit" aria-label="Send message">↗</button>
        </form>
      </div>`;

    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('is-open'));

    const messages = panel.querySelector('#northstar-ai-messages') as HTMLElement;
    const input = panel.querySelector('#northstar-ai-input') as HTMLInputElement;
    const form = panel.querySelector('#northstar-ai-form') as HTMLFormElement;

    const appendMessage = (role: 'user' | 'assistant', content: string): void => {
      const bubble = document.createElement('div');
      bubble.className = `ns-ai-message ${role}`;
      bubble.textContent = content;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    };

    const send = async (rawMessage: string): Promise<void> => {
      const message = rawMessage.trim();
      if (!message) return;

      appendMessage('user', message);
      input.value = '';
      input.disabled = true;
      const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      submit.disabled = true;

      const thinking = document.createElement('div');
      thinking.className = 'ns-ai-message assistant ns-ai-thinking';
      thinking.textContent = 'Curating an answer…';
      messages.appendChild(thinking);
      messages.scrollTop = messages.scrollHeight;

      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await response.json();
        thinking.remove();
        if (!response.ok) throw new Error(data?.detail || 'Request failed');
        appendMessage('assistant', data.reply || 'I couldn’t find an answer for that just yet.');
      } catch {
        thinking.remove();
        appendMessage('assistant', 'I’m having a little trouble connecting right now. Please try again in a moment.');
      } finally {
        input.disabled = false;
        submit.disabled = false;
        input.focus();
      }
    };

    panel.querySelector('.ns-ai-close')?.addEventListener('click', () => panel.classList.remove('is-open'));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void send(input.value);
    });
    panel.querySelectorAll<HTMLButtonElement>('[data-prompt]').forEach((button) => {
      button.addEventListener('click', () => void send(button.dataset['prompt'] || ''));
    });

    input.focus();
  }

  protected onButton5Click($event: MouseEvent): void {
    $event.preventDefault();
    this.openChat();
  }

  protected onButton6Click($event: MouseEvent): void {
    alert('Product Detail Page — Coming Soon');
    $event.preventDefault();
  }

  protected onButton7Click($event: MouseEvent): void {
    alert('Product Detail Page — Coming Soon');
    $event.preventDefault();
  }

  protected onButton8Click($event: MouseEvent): void {
    alert('Product Detail Page — Coming Soon');
    $event.preventDefault();
  }

  protected onButton9Click($event: MouseEvent): void {
    alert('Product Detail Page — Coming Soon');
    $event.preventDefault();
  }

  protected onButton10Click($event: MouseEvent): void {
    alert('Product Detail Page — Coming Soon');
    $event.preventDefault();
  }

  protected onButton11Click($event: MouseEvent): void {
    alert('Full Catalog — Coming Soon');
    $event.preventDefault();
  }

  protected onButton12Click($event: MouseEvent): void {
    $event.preventDefault();
    this.openChat();
  }
}
