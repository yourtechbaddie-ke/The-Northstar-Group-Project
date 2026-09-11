import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from './components/Components/user-profile.component';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-root',
  host: { class: 'jbx-root' },
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [UserProfileComponent, RouterLink, CommonModule]
})
export class AppComponent {
  protected chatOpen = false;
  protected chatLoading = false;
  protected chatInput = '';
  protected chatMessages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Welcome to Northstar. I’m your AI styling concierge — ask me about products, availability, or what might suit your look.'
    }
  ];

  private readonly apiEndpoint = 'https://northstar-ai-support-chatbot-jctw.onrender.com/api/chat';

  protected openChat(): void {
    this.chatOpen = true;
  }

  protected closeChat(): void {
    this.chatOpen = false;
  }

  protected async sendChatMessage(): Promise<void> {
    const message = this.chatInput.trim();
    if (!message || this.chatLoading) return;

    this.chatMessages = [...this.chatMessages, { role: 'user', content: message }];
    this.chatInput = '';
    this.chatLoading = true;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || 'The concierge is temporarily unavailable.');
      }

      this.chatMessages = [
        ...this.chatMessages,
        { role: 'assistant', content: data.reply || 'I’m sorry, I couldn’t find an answer for that just yet.' }
      ];
    } catch {
      this.chatMessages = [
        ...this.chatMessages,
        {
          role: 'assistant',
          content: 'I’m having a little trouble connecting right now. Please try again in a moment.'
        }
      ];
    } finally {
      this.chatLoading = false;
    }
  }

  protected onChatKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.sendChatMessage();
    }
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
