import { Context } from '@nuxt/types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mocks } from '~/api';

export default function (context: Context) {
    const { $axios } = context;

    const mock = new MockAdapter(axios);
    mocks(mock);

    console.log('da!', $axios)
}
