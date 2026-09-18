<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { DocumentEditor, type TemplateVariable, fillTemplate } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'variables'] as const;

// Variables appear in the toolbar's { } menu; typing {{client_name}} inserts one as well.
const variables: TemplateVariable[] = [
  { name: 'client_name', label: 'Client name' },
  { name: 'contract_date', label: 'Contract date' },
  { name: 'amount', label: 'Amount' }
];

// A variable is saved as <span data-variable="name">{{name}}</span>.
const template = ref(
  '<p>Dear <span data-variable="client_name">{{client_name}}</span>,</p>' +
    '<p>We confirm the contract of <span data-variable="contract_date">{{contract_date}}</span> ' +
    'for the total of <span data-variable="amount">{{amount}}</span>.</p>'
);

const values = reactive({ client_name: 'Aziz Karimov', contract_date: '14.09.2026', amount: '15 000 000 UZS' });

// fillTemplate escapes the values and works in the browser and on a Node server alike.
const filled = computed(() => fillTemplate(template.value, values));
</script>

<template>
  <div class="example-stage">
    <DocumentEditor :tools="TOOLS" v-model="template" :variables="variables" default-view-mode="web" :height="300" />

    <div class="example-columns">
      <section class="example-panel">
        <h3>Values</h3>
        <div class="example-stage">
          <label v-for="variable in variables" :key="variable.name" class="example-field">
            {{ variable.label }}
            <input v-model="values[variable.name as keyof typeof values]" class="example-input" />
          </label>
        </div>
      </section>
      <section class="example-panel">
        <h3>fillTemplate(template, values)</h3>
        <div class="example-preview" v-html="filled" />
      </section>
    </div>
  </div>
</template>
