import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import PlayerBar from '~/components/PlayerBar.vue'
import { usePlayerStore } from '~/stores/player'

const mount = () =>
  mountSuspended(PlayerBar, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
  })

describe('Player', () => {
  it('показывает название текущего трека из стора', async () => {
    const wrapper = await mountSuspended(PlayerBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              player: {
                currentTrack: {
                  id: 1,
                  name: 'Test Song',
                  author: 'Test Artist',
                  track_file: 'test.mp3',
                },
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('Test Artist')
  })

  it('кнопка next переключает на следующий трек', async () => {
    const wrapper = await mount()
    const store = usePlayerStore()

    await wrapper.find('[data-test="next"]').trigger('click')
    expect(store.nextTrack).toHaveBeenCalled()
  })

  it('кнопка prev переключает на предыдущий трек', async () => {
    const wrapper = await mount()
    const store = usePlayerStore()

    await wrapper.find('[data-test="prev"]').trigger('click')
    expect(store.prevTrack).toHaveBeenCalled()
  })

  it('кнопка shuffle вызывает toggleShuffle', async () => {
    const wrapper = await mount()
    const store = usePlayerStore()

    await wrapper.find('[data-test="shuffle"]').trigger('click')
    expect(store.toggleShuffle).toHaveBeenCalled()
  })
})
