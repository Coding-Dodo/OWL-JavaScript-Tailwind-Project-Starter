import { Component, useState, tags, hooks } from "@odoo/owl";
const { useExternalListener } = hooks;

const AUTO_COMPLETE_INPUT_TEMPLATE = tags.xml/*xml*/ `
<div class="relative" v-click-outside="clickedOutside">
    <input
      t-att-value="props.value ? props.value.name : ''"
      t-on-input="handleShowOptions"
      t-on-click="handleShowOptions"
      t-att-placeholder="props.placeHolder"
      ref="input"
      tabindex="0"
      t-att-class="props.inputClass ? props.inputClass : 'border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:shadow-outline'"
    />
    <span
      t-if="props.value"
      t-on-click.prevent="reset()"
      class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
    >
      x
    </span>
    <div
      t-if="state.showOptions"
      tabindex="0"
      t-att-class="props.dropdownClass ? props.dropdownClass : 'absolute w-full z-50 bg-white border border-gray-300 mt-1 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md'"
    >
      <ul class="py-1">
        <li
          t-foreach="searchResults()" t-as="searchResult"
          t-on-click.prevent="handleClick(searchResult)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-200"
        >
          <t t-esc="searchResult.name"/>
        </li>
        <li t-if="!searchResults().length" class="px-3 py-2 text-center">
          No Matching Results
        </li>
      </ul>
    </div>
</div>

`;

export class AutoCompleteInput extends Component {
  static template = AUTO_COMPLETE_INPUT_TEMPLATE;
  static props = {
    placeHolder: { type: String, optional: true },
    inputClass: { type: String, optional: true },
    dropdownClass: { type: String, optional: true },
    data: {
      type: Array,
    },
    value: { name: "", optional: true },
  };
  state = useState({
    showOptions: false,
    chosenOption: "",
    searchTerm: "",
  });

  constructor(...args) {
    super(...args);
    useExternalListener(window, "click", this.hideOptions);
  }

  hideOptions(event) {
    if (!this.el.contains(event.target)) {
      Object.assign(this.state, { showOptions: false });
    }
  }

  reset() {
    this.trigger("input", "");
    this.trigger("chosen", { selectedTechnology: null });
    Object.assign(this.state, {
      chosenOption: "",
      searchTerm: "",
      showOptions: false,
    });
  }

  handleShowOptions(evt) {
    // this.$emit("input", evt.target.value);
    console.log(evt);
    Object.assign(this.state, {
      searchTerm: evt.target.value,
      showOptions: true,
    });
  }

  searchResults() {
    return this.props.data.filter((item) => {
      return item.name
        .toLowerCase()
        .includes(this.state.searchTerm.toLowerCase());
    });
  }

  handleClick(item) {
    this.trigger("input", item.name);
    this.trigger("chosen", { selectedTechnology: item });
    Object.assign(this.state, {
      chosenOption: item.name,
      showOptions: false,
      searchTerm: item.name,
    });
  }
}
