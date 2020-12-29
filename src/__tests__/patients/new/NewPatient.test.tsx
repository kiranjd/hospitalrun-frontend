import { Toaster } from '@hospitalrun/components'
// import { mount } from 'enzyme'
import { act, render as rtlRender, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../page-header/title/TitleContext'
import GeneralInformation from '../../../patients/GeneralInformation'
import NewPatient from '../../../patients/new/NewPatient'
// import * as patientSlice from '../../../patients/patient-slice'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('New Patient', () => {
  let history: any
  let store: MockStore

  const setup = (error: any, patient: Patient) => {
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(PatientRepository, 'save').mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)

    history.push('/patients/new')
    return rtlRender(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/new">
            <TitleProvider>
              <NewPatient />
            </TitleProvider>
          </Route>
        </Router>
        <Toaster draggable hideProgressBar />
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a general information form', () => {
    setup()

    expect(screen.getByText(/patient\.basicinformation/i)).toBeInTheDocument()
  })

  it('should render an error', () => {
    const expectedError = { message: 'an error message' }
    setup({ expectedError })

    expect(screen.getByText(expectedError.message)).toBeInTheDocument()
  })

  it('should create patient when save button is clicked', async () => {
    setup({ patient })

    userEvent.click(
      screen.getByRole('button', {
        name: /patients\.createpatient/i,
      }),
    )

    await waitFor(() => {
      expect(screen.getByText(/patients\.successfullyCreated/)).toBeInTheDocument()
    })

    screen.logTestingPlaygroundURL()

    // expect(PatientRepository.save).toHaveBeenCalledWith(patient)

    // userEvent.click
    // let wrapper: any
    // await act(async () => {
    //   wrapper = await setup()
    // })

    // const generalInformationForm = wrapper.find(GeneralInformation)

    // act(() => {
    //   generalInformationForm.prop('onChange')(patient)
    // })

    // wrapper.update()

    // const saveButton = wrapper.find('.btn-save').at(0)
    // const onClick = saveButton.prop('onClick') as any
    // expect(saveButton.text().trim()).toEqual('patients.createPatient')

    // await act(async () => {
    //   await onClick()
    // })

    // expect(store.getActions()).toContainEqual(patientSlice.createPatientStart())
    // expect(store.getActions()).toContainEqual(patientSlice.createPatientSuccess())
  })

  // it('should reveal modal (return true) when save button is clicked if an existing patient has the same information', async () => {
  //   let wrapper: any
  //   await act(async () => {
  //     wrapper = await setup()
  //   })

  //   const saveButton = wrapper.find('.btn-save').at(0)
  //   const onClick = saveButton.prop('onClick') as any
  //   expect(saveButton.text().trim()).toEqual('patients.createPatient')

  //   act(() => {
  //     onClick()
  //   })
  //   wrapper.update()

  //   expect(onClick()).toEqual(true)
  // })

  // it('should navigate to /patients/:id and display a message after a new patient is successfully created', async () => {
  //   jest.spyOn(components, 'Toast').mockImplementation(jest.fn())
  //   let wrapper: any
  //   await act(async () => {
  //     wrapper = await setup()
  //   })

  //   const generalInformationForm = wrapper.find(GeneralInformation)

  //   act(() => {
  //     generalInformationForm.prop('onChange')(patient)
  //   })

  //   wrapper.update()

  //   const saveButton = wrapper.find('.btn-save').at(0)
  //   const onClick = saveButton.prop('onClick') as any
  //   expect(saveButton.text().trim()).toEqual('patients.createPatient')

  //   await act(async () => {
  //     await onClick()
  //   })

  //   expect(history.location.pathname).toEqual(`/patients/${patient.id}`)
  //   expect(components.Toast).toHaveBeenCalledWith(
  //     'success',
  //     'states.success',
  //     `patients.successfullyCreated ${patient.fullName}`,
  //   )
  // })

  // it('should navigate to /patients when cancel is clicked', async () => {
  //   let wrapper: any
  //   await act(async () => {
  //     wrapper = await setup()
  //   })

  //   const cancelButton = wrapper.find('.btn-cancel').at(0)
  //   const onClick = cancelButton.prop('onClick') as any
  //   expect(cancelButton.text().trim()).toEqual('actions.cancel')

  //   act(() => {
  //     onClick()
  //   })

  //   expect(history.location.pathname).toEqual('/patients')
  // })
})
