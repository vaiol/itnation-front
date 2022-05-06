class Message extends HTMLElement {

  static get observedAttributes() {
    return ['user', 'text', 'date', 'color'];
  }

  attributeChangedCallback(property, oldValue, newValue) {

    if (oldValue === newValue) return;
    this[ property ] = newValue;

  }

  connectedCallback() {
    console.log(this.user);
    const shadow = this.attachShadow({mode: 'closed'});

    shadow.innerHTML = `
          <style>
              .message {
                  position: relative;
                  padding: 12px 15px 5px 15px;
                  background: #F1F1F1;
                  border-radius: 12px;
                  line-height: 150%;
                  align-self: start;
                  margin-bottom: 10px;
                  display: flex;
                  flex-direction: column;
                  max-width: 50%;
              }
              
              .message > .message-name {
                  font-size: 11px;
                  font-weight: bolder;
              }
              
              .message > .message-time {
                  font-size: 10px;
                  color: darkgray;
                  align-self: flex-end;
              }
              
              :host(.self) > .message-time {
                  color: #F1F1F1;
              }
              
              :host(.with-arrow) > .message:before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 0;
                  transform: translateX(-10px);
                  width: 0;
                  height: 0;
                  border-bottom: 21px solid transparent;
                  border-right: 21px solid #F1F1F1;
              }
              
              :host(.self) > .message {
                  background: #615EF0;
                  color: white;
                  align-self: flex-end;
              }
              
              :host(.self.with-arrow) > .message:before {
                  left: initial;
                  right: 0;
                  transform: translateX(10px);
                  border-right: 0;
                  border-left: 21px solid #615EF0;
                  border-bottom: 21px solid transparent;
              }
          </style>
      
          <div class="message">
            <div class="message-name" style="color: ${this.color}">
              ${this.user}
            </div>
            <span>
              ${this.text}
            </span>
            <div class="message-time">
              ${this.date}
            </div>
          </div>
      `;
  }

}

customElements.define('message-item', Message);