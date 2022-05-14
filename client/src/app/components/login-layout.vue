<template>
  <div class="login-layout flex-center full">
    <div class="login-container" @keyup.enter="runLogin">
      <base-message v-if="state.errorMessage" type="danger">
        {{ state.errorMessage }}
      </base-message>

      <base-input
          label="Username"
          type="text"
          placeholder="Enter your username"
          :value="state.username"
          :validation="v$.username"
          @input="(value) => state.username = value"
      />

      <base-input
          label="Password"
          type="password"
          placeholder="Enter your password"
          :value="state.password"
          :validation="v$.password"
          @input="(value) => state.password = value"
      />

      <base-button
          class="block"
          buttonLabel="Login"
          :isLoading="state.isLoginProcessing"
          @click="runLogin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import type { ErrorPayload, UserAccess } from 'global/types';
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH, RequestMethod, ServerEndpoint } from 'global/constants';

import { LOCAL_STORAGE_TOKEN_KEY } from 'shared/constants';


// Types
type ComponentState = {
  isLoginProcessing: boolean;
  username: string;
  password: string;
  errorMessage: string;
}


// Data
const state = reactive<ComponentState>({
  isLoginProcessing: false,
  username: '',
  password: '',
  errorMessage: '',
});

const validationRules = {
  username: { required, minLength: minLength(USERNAME_MIN_LENGTH) },
  password: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
};

const v$ = useVuelidate(validationRules, state);


// Methods
async function runLogin(): Promise<void> {
  v$.value.$reset();
  const isInputsValid: boolean = await v$.value.$validate();

  if (!isInputsValid) {
    return;
  }

  v$.value.$reset();
  state.isLoginProcessing = true;

  try {
    const { username, password } = state;

    const response = await fetch(ServerEndpoint.AUTH_LOGIN, {
      method: RequestMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json() as UserAccess;

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, result.token);

      return location.reload();
    }

    const { message } = await response.json() as ErrorPayload;

    state.errorMessage = message;
  } catch (e: any) {
    console.error(e);

    state.errorMessage = e.message;
  }

  state.isLoginProcessing = false;
}
</script>

<style lang="scss" scoped>
.login-layout {
  background: var(--colors-background-app);
}

.login-container {
  background: var(--colors-background-section);
  border-radius: var(--sizes-border-radius-default);
  padding: 50px;
  min-width: 400px;

  .p-button {
    margin-top: 40px;
  }
}
</style>
