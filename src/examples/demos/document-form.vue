<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, type TemplateVariable } from 'nuvra';

// A template saved earlier by the editor; every variable becomes an input in its place.
const template =
  '<h2 style="text-align: center">Application</h2>' +
  '<p>I, <span data-variable="full_name">{{full_name}}</span>, ask to be granted annual leave from ' +
  '<span data-variable="start_date">{{start_date}}</span> for <span data-variable="days">{{days}}</span> days.</p>' +
  '<p style="text-align: right"><span data-variable="full_name">{{full_name}}</span></p>';

const variables: TemplateVariable[] = [
  { name: 'full_name', label: 'Full name' },
  { name: 'start_date', label: 'Start date' },
  { name: 'days', label: 'Days' }
];

const values = ref<Record<string, string>>({});
const form = ref<InstanceType<typeof DocumentForm>>();
const result = ref('');

const submit = () => {
  // validate() marks the empty fields, focuses the first one and returns their names.
  if (form.value?.validate().length) {
    result.value = '';
    return;
  }
  result.value = form.value?.getHTML() ?? '';
};
</script>

<template>
  <div class="example-stage">
    <DocumentForm ref="form" v-model="values" :template="template" :variables="variables" />

    <div class="example-bar">
      <button type="button" class="example-button example-button--primary" @click="submit">Submit</button>
      <span class="example-note">Fields of the same variable share one value.</span>
    </div>
    <pre v-if="result" class="example-output">{{ result }}</pre>
  </div>
</template>
