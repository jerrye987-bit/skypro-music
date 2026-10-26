import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import SideBar from '~/components/SideBar.vue'
import { useAuthStore } from '~/stores/auth'

describe('SideBar', () => {
  it('показывает имя залогиненного пользователя', async () => {
    const wrapper = await mountSuspended(SideBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: { username: 'Test User' },
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('Test User')
  })

  it('показывает «Гость» без пользователя', async () => {
    const wrapper = await mountSuspended(SideBar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('Гость')
  })

  it('кнопка выхода вызывает authStore.logout', async () => {
    const wrapper = await mountSuspended(SideBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: { username: 'Test User' },
              },
            },
          }),
        ],
      },
    })

    const store = useAuthStore()

    await wrapper.find('[data-test="logout"]').trigger('click')
    expect(store.logout).toHaveBeenCalled()
  })
})
