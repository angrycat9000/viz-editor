import { html, css, LitElement } from 'lit-element';
const deleteIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`;
const addIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`
const arrowIcon = html`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 9.5H9.5V9V3V1.79289L8.64645 2.64645L2.64645 8.64645L1.79289 9.5H3H9Z" fill="black" stroke="#808080"/>
</svg>
`


export class VizEditor extends LitElement {
  constructor() {
    super();
    this.config = []
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .color-picker {
        height:5rem;
        width:2rem;
        border-radius: 0.125rem;
        border:1px solid #808080;
        background:none;
        margin-right:0.5rem;
        position:relative;
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        justify-content:flex-end;
        padding: 0.125rem;
      }

      .color-picker:after {
        position:absolute;
        display:block;
        content:'';
        top:0;
        left:0;
        height:100%;
        width:100%;
        border:0;
        background: url(grid.svg);
        z-index:-1;
      }

      input[type=number] {
        width:6rem;
        height:2rem;
        font-size:1rem;
        border-radius:0.125rem;
        border:1px solid #808080;
      }

      .range {
        align-self:stretch;
        margin-right:1rem;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        flex-grow:100;
      }

      .lower{
        font: 1rem sans-serif;
      }
      
      .card,
      .add {
        width:15rem;
        display:flex;
        align-items:center;
      }


      .add {
        height:1rem; 
        overflow:visible;
        justify-content:space-between;
        margin: 0;
        //margin: 0.125rem 0;
      }
      .add button {order:2}
      .add hr {
        order:1
        border:0; 
        border-style:solid;
        border-color:rgba(0,0,0,0.5);
        border-width: 1px 0 0 0;
        flex-grow:100;
        margin-right: 0.5rem;
        margin-left: 2.5rem;
        //margin-left:0.5rem;
      }

      .remove,
      .add button {
        background:0;
        border-radius:0.125rem;
        border:1px solid #808080;
        width:2rem;
        height:2rem;
        padding:0;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      
    `;
  }

  static get properties() {
    return {
      config: {type: Array},
      max: { type: Number, default: Number.POSITIVE_INFINITY },
      min: { type: Number, default: Number.NEGATIVE_INFINITY },
      epsilon: {type: Number, default: 0.01},
    };
  }

  render() {
    return html`

    ${this.config
      .map((c,i)=>{return {...c, originalIndex:i}})
      .sort((a,b)=>{
        if(a.upper < b.upper) return 1;
        if(b.upper < a.upper) return -1;
        return 0;
      })
      .map((c,i,config)=>{
      const lower = (config.length <= i +1) ? this.min : config[i+1].upper + this.epsilon;
      const addRow  = html
        `<div class="add">
          <button 
            title="Add Color"'
            @click="${()=>this.add()}">${addIcon}</button>
          <hr>
        </div>`;
      return html`
      ${i > 0 ? addRow : html``}
      <div class="card">
        <button 
          title="Change Color" 
          class="color-picker" 
          style="background:${this.formatBackground(c.fill)}"
          @click="${()=>this.pickColor(c.originalIndex)}">${arrowIcon}</button>
        <div class="range">
          <input 
            type="number" 
            class="upper" 
            value="${this.formatNumber(c.upper)}"
            @input="${(e)=>this.updateUpper(c.originalIndex,e)}">
          <div class="lower">${lower}</div>
        </div>
        <button title="Remove Color" class="remove" @click=${()=>{this.remove(c.originalIndex)}}>${deleteIcon}</button>
      </div>
    `})}
    `;
  }
  
  add() {
    this.config.push({upper:0, fill:[]});
    this.requestUpdate();
  }
  updateUpper(index, event) {
    this.config[index].upper = Number.parseFloat(event.target.value);
    this.requestUpdate();
  }


  pickColor(index) {
    window.alert('Show color / gradient picker here');
  }

  remove(index) {
    this.config.splice(index,1);
    this.requestUpdate();
  }

  formatNumber(n) {
    // TODO format with epsilon
    if(Number.POSITIVE_INFINITY === n || Number.NEGATIVE_INFINITY === n)
      return '';
    return n.toFixed(2);
  }

  formatBackground(fill) {
    if(0 == fill.length)
      return 'transparent';

    if(1 == fill.length)
      return colorToCSS(fill[0])

    return `linear-gradient(${colorToCSS(fill[0])}, ${colorToCSS(fill[1])})`;
  }
}


function colorToCSS(c) {
  return `rgba(${c.red},${c.green},${c.blue},${c.alpha})`
}