import { call, delay, put, takeLatest } from "redux-saga/effects";
import {
  addContent,
  createNews,
  editContent,
  getNewsPublic,
  removeContent,
  removeNews,
  updateNews,
} from "../api/news-api";
// import * as newsSlice from "../../slices/news/newsSlice";
import * as newsSlice from "../slices/news-slice";

function* createNewsRequest({ payload }) {
  const { createNewsError, createNewsSuccess } = newsSlice;
  try {
    const result = yield call(createNews, payload);
    if (result.name === "AxiosError") {
      yield put(createNewsError({ message: result.message }));
    } else {
      yield put(createNewsSuccess(result.data));
      if (payload.cb) yield call(payload.cb);
    }
  } catch (error) {
    yield put(createNewsError({ message: error?.message }));
  }
}

function* getNewsRequest({ payload }) {
  const { getNewsError, getNewsSuccess } = newsSlice;
  try {
    const result = yield call(getNewsPublic, payload);
    if (result.name === "AxiosError") {
      yield put(getNewsError({ message: result.message }));
    } else {
      yield put(getNewsSuccess(result));
    }
  } catch (error) {
    yield put(getNewsError(error));
  }
}

function* removeNewsRequest({ payload }) {
  const { removeNewsError, getNewsFetch, removeNewsSuccess } = newsSlice;
  try {
    const result = yield call(removeNews, payload);
    if (result.name === "AxiosError") {
      yield put(removeNewsError({ message: result.message }));
    } else {
      yield put(removeNewsSuccess(result.data));
      yield put(getNewsFetch());
    }
  } catch (error) {
    yield put(removeNewsError({ message: error?.message }));
  }
}

function* updateNewsRequest({ payload }) {
  const { updateNewsError, updateNewsSuccess, getNewsFetch } = newsSlice;
  try {
    const result = yield call(updateNews, payload);

    if (result.name === "AxiosError") {
      yield put(updateNewsError({ message: result.message }));
    } else {
      yield put(updateNewsSuccess(result.data));
      yield put(getNewsFetch());
    }
  } catch (error) {
    yield put(updateNewsError({ message: error }));
  }
}

function* removeContentRequest({ payload }) {
  const { removeContentError, removeContentSuccess, getNewsFetch } = newsSlice;
  try {
    const result = yield call(removeContent, payload);
    if (result.name === "AxiosError") {
      yield put(removeContentError({ message: result.message }));
    } else {
      yield put(removeContentSuccess(result.data));
      yield put(getNewsFetch());
    }
  } catch (error) {
    yield put(removeContentError({ message: error }));
  }
}

function* addContentRequest({ payload }) {
  const { addContentError, addContentSuccess, getNewsFetch } = newsSlice;
  try {
    const result = yield call(addContent, payload);
    if (result.name === "AxiosError") {
      yield put(addContentError({ message: result.message }));
    } else {
      yield put(addContentSuccess(result.data));
      yield put(getNewsFetch());
    }
  } catch (error) {
    yield put(addContentError({ message: error }));
  }
}

function* editContentRequest({ payload }) {
  const { editContentError, editContentSuccess, getNewsFetch } = newsSlice;
  try {
    const result = yield call(editContent, payload);
    if (result.name === "AxiosError") {
      yield put(editContentError({ message: result.message }));
    } else {
      yield put(editContentSuccess(result.data));
      yield put(getNewsFetch());
    }
  } catch (error) {
    yield put(editContentError({ message: error }));
  }
}

export default function* newsSaga() {
  yield takeLatest(newsSlice.creatingNews.type, createNewsRequest);
  yield takeLatest(newsSlice.getNewsFetch.type, getNewsRequest);
  yield takeLatest(newsSlice.removingNews.type, removeNewsRequest);
  yield takeLatest(newsSlice.updatingNews.type, updateNewsRequest);
  yield takeLatest(newsSlice.removingContent.type, removeContentRequest);
  yield takeLatest(newsSlice.addingContent, addContentRequest);
  yield takeLatest(newsSlice.edittingContent, editContentRequest);
}
