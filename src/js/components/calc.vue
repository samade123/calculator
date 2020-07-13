<template>
<div class="calc-page">
  <div class="top">
    <div class="input">
      <span v-for="number in tempVal">{{number}}</span>
      <span v-if="tempVal.length > 0" class="material-icons backspace" @click="tempVal.pop()">backspace</span>
    </div>
  </div>
  <div class="bottom">
    <div class="keypad">
      <div class="left">
        <div class="row" v-for="row in btns">
          <vs-button v-for="btn in row" type="flat" size="large" @click="pressBtn(btn)">{{btn.label}}</vs-button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="right">
        <vs-button v-for="btn in operations" type="flat" size="large" >{{btn.label}}</vs-button>

      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      btns: {
        topRow: [{label: "1", type: "num", value: 1}, {label: "2", type: "num", value: 2},{label: "3", type: "num", value: 3}],
        secondRow: [{label: "4", type: "num", value: 1}, {label: "5", type: "num", value: 5},{label: "6", type: "num", value: 6}],
        thirdRow: [{label: "7", type: "num", value: 7}, {label: "8", type: "num", value: 8},{label: "9", type: "num", value: 9}],
        lastRow: [{label: "0", type: "num", value: 7}, {label: ".", type: "operation", value: "shift"},{label: "=", type: "operation", value: "equal"}],
      },
      operations: [{label: "÷", type: "operation", value: "divide"}, {label: "x", type: "operation", value: "multiply"}, {label: "+", type: "operation", value: "sum"}, {label: "-", type: "operation", value: "minus"}],
      tempVal: [],
      nextVal: false,
    };
  },
  watch: {},
  methods: {
    pressBtn(btn) {
      this.tempVal.push(btn.label);
    },
  },
  created() {},
  mounted() {},
};
</script>
