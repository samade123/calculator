<template>
<div class="calc-page">
  <div class="top">
    <div class="input" :style="{fontSize: fontSize()}">
      <span v-for="number in tempVal">{{number}}</span>
      <span v-if="totalVal.show">{{totalVal.value}}</span>
      <span v-if="totalVal.show > 0" class="material-icons backspace" @click="clearTotal()">backspace</span>
      <span v-if="tempVal.length > 0" class="material-icons backspace" @click="tempVal.pop()">backspace</span>
    </div>
    <div class="summary" v-if="firstVal.label.length > 0">{{firstVal.value}} {{operation.label}} <span v-if="secondVal.label.length" >{{secondVal.value}}</span></div>
    <div class="summary" v-else > </div>
  </div>
  <div class="bottom">
    <div class="keypad">
      <div class="left">
        <div class="row" v-for="row in btns">
          <vs-button v-for="btn in row" type="flat" :disabled="btn.disabled" size="large" @click="pressBtn(btn)">{{btn.label}}</vs-button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="right">
        <vs-button v-for="btn in operations" :disabled="btn.disabled" type="flat" size="large" @click="pressBtn(btn)" >{{btn.label}}</vs-button>
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
        lastRow: [{label: "0", type: "num", value: 7}, {label: ".", type: "operation", value: "shift" , disabled: true},{label: "=", type: "equal", value: "equal"}],
      },
      operations: [{label: "÷", type: "operation", value: "divide", disabled: false}, {label: "x", type: "operation", value: "multiply", disabled: false,}, {label: "+", type: "operation", value: "sum", disabled: false}, {label: "-", type: "operation", value: "minus", disabled: false,},],
      tempVal: [],
      firstVal: {label: "", value: 0},
      secondVal: {label: "", value: 0},
      operation: {label: "", function: ""},
      totalVal: {value: 0, show: false},
      equationStore: [],
      nextVal: false,
    };
  },
  watch: {},
  methods: {
    fontSize(){
    if (this.windowWidth < 600){
      return this.tempVal.length > 4 || this.totalVal.value.toString().length > 4 ? "4em" : "6em";
    }
    },
    clearTotal(){
      this.totalVal.show = false;
      this.firstVal = {label: "", value: 0};
      this.secondVal = {label: "", value: 0};
      this.totalVal = {value: 0, show: false};
      this.operation = {label: "", function: ""};

    },
    pressBtn(btn) {

      if(btn.type == "num") {
        if (this.totalVal.show) {
            this.clearTotal();
       }
        this.tempVal.push(btn.label);
      } else if (btn.type == "operation") {
        if (this.totalVal.show) {
          this.totalVal.show = false;
          this.firstVal.value = this.totalVal.value
        }
        this.operation = btn;
        this.storeNewVal()
      } else if (btn.type == "equal") {
        this.calculate()
      }
    },
    storeNewVal(){
      var newVal = this.tempVal.join();
      this.tempVal.forEach((item)=> {
        newVal = newVal.replace(",", "");
      })
      this.firstVal.label.length > 0 ? this.secondVal = { label: newVal, value: parseInt(newVal)} : this.firstVal = { label: newVal, value: parseInt(newVal)};
      console.log(this.firstVal.label)
      this.tempVal = [];
    },
    calculate() {
      this.storeNewVal()

      if (this.operation.value == "sum") {
        this.totalVal.value = this.firstVal.value + this.secondVal.value;
      }
      if (this.operation.value == "minus") {
        this.totalVal.value = this.firstVal.value - this.secondVal.value;
      }
      if (this.operation.value == "multiply") {
        this.totalVal.value = this.firstVal.value * this.secondVal.value;
      }
      if (this.operation.value == "divide") {
        this.totalVal.value = this.firstVal.value / this.secondVal.value;
      }

      this.tempEquation = {firstVal: this.firstVal.value, secondVal: this.secondVal.value, totalVal: this.totalVal.value, operation: this.operation.label,}
      this.equationStore.push(this.tempEquation)
      this.totalVal.show = true;
      console.log(this.equationStore)
      // console.log(this.totalVal.value, this.firstVal.value, this.secondVal.value)
    }
  },
  created() {},
  mounted() {},
};
</script>
