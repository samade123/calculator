<template>
<div class="calc-page">
  <div class="top">
    <div class="input">
      <span v-for="number in tempVal">{{number}}</span>
      <span v-if="totalVal.show">{{totalVal.value}}</span>
      <span v-if="tempVal.length > 0" class="material-icons backspace" @click="tempVal.pop()">backspace</span>
    </div>
    <div class="summary" v-if="firstVal.label.length > 0">{{firstVal.label}} {{operation.label}} <span v-if="secondVal.label.length" >{{secondVal.label}}</span></div>
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
      operations: [{label: "÷", type: "operation", value: "divide", disabled: true}, {label: "x", type: "operation", value: "multiply", disabled: true,}, {label: "+", type: "operation", value: "sum", disabled: false}, {label: "-", type: "operation", value: "minus", disabled: true}],
      tempVal: [],
      firstVal: {label: "", value: 0},
      secondVal: {label: "", value: 0},
      operation: {label: "", function: ""},
      totalVal: {value: 0, show: false},
      nextVal: false,
    };
  },
  watch: {},
  methods: {
    pressBtn(btn) {
      if(btn.type == "num") {
        this.tempVal.push(btn.label);
      } else if (btn.type == "operation") {
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
        this.totalVal.show = true;
        console.log(this.totalVal.value, this.firstVal.value, this.secondVal.value)
      }
    }
  },
  created() {},
  mounted() {},
};
</script>
