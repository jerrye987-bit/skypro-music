import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import SignIn from '~/pages/SignIn.vue'
import { vi } from 'vitest'

const mount = () =>
  mountSuspended(SignIn, {
    global: {
      plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })],
    },
  })

describe('SignIn', () => {
  it('отрисовывает поля email, пароль и кнопку', async () => {
    const wrapper = await mount()

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('передаёт введённые данные в authStore.login', async () => {
    const wrapper = await mount()
    const store = useAuthStore()

    await wrapper.find('input[type="email"]').setValue('test@mail.ru')
    await wrapper.find('input[type="password"]').setValue('qwerty123')
    await wrapper.find('form').trigger('submit')

    expect(store.login).toHaveBeenCalledWith('test@mail.ru', 'qwerty123')
  })

  it('показывает сообщение об ошибке из стора', async () => {
    const wrapper = await mount()
    const store = useAuthStore()

    store.error = 'Неверный пароль'
    await nextTick()

    expect(wrapper.text()).toContain('Неверный пароль')
  })
})
