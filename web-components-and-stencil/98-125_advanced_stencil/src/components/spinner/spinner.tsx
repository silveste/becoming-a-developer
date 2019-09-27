import {h, Component } from '@stencil/core'

@Component({
  tag: 'se-spinner',
  styleUrl: './spinner.css',
  shadow: true
})

export class Spinner {
  render() {
    return (
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}
