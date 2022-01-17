<template>
  <validated-form ref="form"
                  class="course-form"
                  @submit='submit'
                  @form_validity_changed="$emit('form_validity_changed', $event)">
    <div class="form-field-wrapper">
      <label class="label"> Username </label>
      <validated-input ref="username_input"
                       v-model="d_form_data.username"
                       input_style="width: 100%;
                                    max-width: 500px;"
                       :validators="[is_not_empty]">
      </validated-input>
    </div>

    <div class="form-field-wrapper">
      <label class="label"> Password </label>
      <ValidatedInput ref="password_input"
                      v-model="d_form_data.password"
                      input_style="width: 100%;
                                    max-width: 500px;"
                      :validators="[is_not_empty]">
      </ValidatedInput>
    </div>
  
    <slot></slot>

  </validated-form>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';


import { AllCourses, Course, CourseObserver, Semester, User } from 'ag-client-typescript';
import { GlobalData } from '@/app.vue';
import Tooltip from '@/components/tooltip.vue';
import ValidatedForm from '@/components/validated_form.vue';
import ValidatedInput from '@/components/validated_input.vue';
import { handle_api_errors_async } from '@/error_handling';
import { deep_copy, format_datetime_short } from '@/utils';
import {
  is_integer,
  is_non_negative,
  is_not_empty,
  is_number,
  make_min_value_validator,
  string_to_num
} from '@/validators';

export class LoginFormData {
  username: string;
  password: string;

  constructor({
    username = '',
    password = '',
  }: Partial<LoginFormData> = {}) {
    this.username = username; 
    this.password = password;
  }
}

@Component({
  components: {
    ValidatedForm,
    ValidatedInput,
  }
})
export default class LoginForm extends Vue {
  @Inject({from: 'globals'})
  globals!: GlobalData;
  d_globals = this.globals;

  d_form_data = new LoginFormData();

  readonly is_non_negative = is_non_negative;
  readonly is_not_empty = is_not_empty;
  readonly is_integer = is_integer;
  readonly is_number = is_number;
  readonly is_valid_course_year = make_min_value_validator(2000);
  readonly string_to_num = string_to_num;

  readonly format_datetime_short = format_datetime_short;

  created() {
    this.d_form_data = new LoginFormData({});

    this.$nextTick(() => {
      (<ValidatedInput> this.$refs.username_input).focus();
    });
  }

  submit() {
    this.$emit('submit', this.d_form_data);
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/forms.scss';
</style>
