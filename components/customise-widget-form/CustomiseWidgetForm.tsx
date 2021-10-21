import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon } from "@heroicons/react/outline";
import { User } from "next-auth";
import { useSession } from "next-auth/client";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../utils/firebaseClient";
import Loader from "../../utils/loader";
import copy from 'copy-to-clipboard';
import { Wallet } from "../../pages/widget/[id]";
import WidgetComponent from "../Widget";

export interface Widget extends FormValues {
    id: string;
    userId: string;
}

export interface FormValues {
    firstName: string;
    widgetColor: string;
    widgetPosition: string;
    wallet_address: Wallet[];
}

export interface UserResponse extends User {
    id: string
}

function CustomiseWidgetForm() {
    const [session] = useSession()
    const widgetDBCollection = db.collection('widgets')
    const usersDBCollection = db.collection('users')
    const [currentUser, setCurrentUser] = useState<UserResponse>()
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentWidget, setCurrentWidget] = useState<Widget>()
    const [editMode, setEditMode] = useState(false)
    const [scriptModalVisible, setScriptModalVisible] = useState(false)
    const [copyButtonText, setCopyButtonText] = useState('Copy')

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        defaultValues: {
            firstName: "",
            widgetColor: "#e66465",
            widgetPosition: "right",
            wallet_address: [
                { id: '0', name: 'Bitcoin', public_address: '' },
                { id: '1', name: 'Ethereum', public_address: '' },
                { id: '2', name: 'Solana', public_address: '' },
                { id: '3', name: 'USDT', public_address: '' }
            ]
        }
    });

    const closeModal = () => setScriptModalVisible(false)

    const widgetScript = !!currentWidget ? `<script src="https://cdn.jsdelivr.net/gh/shindeajinkya/cryptocoffeewidgetscript/widgetscript.min.js" data-name="crypto-coffee-widget" data-userid='${currentWidget.userId}' data-color='${currentWidget.widgetColor}' data-position="${currentWidget.widgetPosition}" data-x_margin="18" data-y_margin="18"></script>` : ''

    const copyScript = () => {
        setCopyButtonText('Copied!')
        copy(widgetScript)
        setTimeout(() => setCopyButtonText('Copy'), 2000)
    }

    const getCurrentUser = async () => {
        try {
            const currentUserResponse = await usersDBCollection.where('email', '==', session.user.email).get()

            if(currentUserResponse.docs[0]) {
                const currentUser = {
                    ...currentUserResponse.docs[0].data() as User,
                    id: currentUserResponse.docs[0].id
                }
                setCurrentUser(currentUser)
                return currentUser
            } else {
                return null
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddressInputChange = (name: string, value: string) => {
        const index = name.split('.')[1]
        const wallet_address = [...currentWidget.wallet_address]
        wallet_address[index].public_address = value
        setCurrentWidget({
            ...currentWidget,
            wallet_address
        })
    }

    const getEditOrNewState = async () => {
        setLoading(true)
        try {
            const currentUser = await getCurrentUser()
            const widgetResponse = await widgetDBCollection.where('userId', '==', currentUser.id).get()

            setEditMode(!!widgetResponse.docs[0])

            if(!!widgetResponse.docs[0]) {
                const widget = {
                    ...widgetResponse.docs[0].data() as Widget,
                    id: widgetResponse.docs[0].id
                }
                setCurrentWidget(widget)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const addWidget = async (data: FormValues) => {
        setIsSubmitting(true)
        try {
            const widgetResponse = await widgetDBCollection.add({
                ...data,
                userId: currentUser.id
            })
            const widget = await widgetResponse.get()
            setEditMode(!!widget.data())
            setCurrentWidget({
                ...widget.data() as Widget,
                id: widget.id
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const editWidget = async (data: FormValues) => {
        setIsSubmitting(true)
        try {
            await widgetDBCollection.doc(currentWidget.id).update({
                ...data,
                userId: currentUser.id
            })
            const widget = await widgetDBCollection.doc(currentWidget.id).get()
            setCurrentWidget({
                ...widget.data() as Widget,
                id: widget.id
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const setWidgetFormValues = (widget: Widget) => {
        setValue('firstName', widget.firstName)
        setValue('widgetColor', widget.widgetColor)
        setValue('widgetPosition', widget.widgetPosition)
        setValue('wallet_address', widget.wallet_address)
    }

    const onSubmit = async (data: FormValues) => {
        if(!editMode) {
            addWidget(data)
        } else {
            editWidget(data)
        }
    };

    useEffect(() => {
        getEditOrNewState()
    }, [session?.user?.email])

    useEffect(() => {
        if(!!currentWidget){
            setWidgetFormValues(currentWidget)
        }
    }, [currentWidget])

    return loading ? <Loader /> : (
        <>
            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="shadow overflow-hidden sm:rounded-md">
                                <div className="px-4 py-5 bg-white sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">

                                        {/* name section */}
                                        <div className="col-span-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="first-name"
                                                autoComplete="given-name"
                                                placeholder="Name to display on widget"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                {...register("firstName", {
                                                    value: currentWidget?.firstName,
                                                    onChange: (e) => setCurrentWidget({
                                                        ...currentWidget,
                                                        firstName: e.target.value
                                                    })
                                                })}
                                            />
                                        </div>

                                        {/* website URL section */}

                                        {/* coin list section */}
                                        <div className="col-span-6">
                                            <div>
                                                <label htmlFor="bitcoin-address" className="block text-sm font-medium text-gray-700">
                                                    Coins
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        Bitcoin
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="wallet_address[0].public_address"
                                                        id="bitcoin-address"
                                                        placeholder="Bitcoin address"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        {...register("wallet_address.0.public_address", {
                                                            onChange: (e) => handleAddressInputChange('wallet_address.0.public_address', e.target.value),
                                                            value: currentWidget?.wallet_address[0].public_address
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6">
                                            <div>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        Ethereum
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="wallet_address[1].public_address"
                                                        id="ethereum-address"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="Ethereum address"
                                                        {...register("wallet_address.1.public_address", {
                                                            onChange: (e) => handleAddressInputChange('wallet_address.1.public_address', e.target.value),
                                                            value: currentWidget?.wallet_address[1].public_address
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6">
                                            <div>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        Solana
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="wallet_address[2].public_address"
                                                        id="solana-address"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="Solana address"
                                                        {...register("wallet_address.2.public_address", {
                                                            onChange: (e) => handleAddressInputChange('wallet_address.2.public_address', e.target.value),
                                                            value: currentWidget?.wallet_address[2].public_address
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6">
                                            <div>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        USDT
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="wallet_address[3].public_address"
                                                        id="tether-address"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="USDT address"
                                                        {...register("wallet_address.3.public_address", {
                                                            onChange: (e) => handleAddressInputChange('wallet_address.3.public_address', e.target.value),
                                                            value: currentWidget?.wallet_address[3].public_address
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* widget color section */}
                                        <fieldset>
                                            <div>
                                                <legend className="text-base font-medium text-gray-900">Color of widget</legend>
                                                <p className="text-sm text-gray-500">Thematic color</p>
                                            </div>
                                            <div className="mt-4 space-y-4">
                                                <div className="flex items-center">
                                                    <input
                                                        name="widgetColor"
                                                        type="color"
                                                        {...register("widgetColor", { required: true, onChange: (e) => setCurrentWidget({
                                                            ...currentWidget,
                                                            widgetColor: e.target.value
                                                        }) })}
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>

                                        {/* position button */}
                                        <fieldset>
                                            <div>
                                                <legend className="text-base font-medium text-gray-900">Position</legend>
                                                <p className="text-sm text-gray-500">Display location of widget</p>
                                            </div>
                                            <div className="mt-4 space-y-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="push-everything"
                                                        name="push-notifications"
                                                        type="radio"
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        value="left"
                                                        {...register("widgetPosition", { required: true })}
                                                    />
                                                    <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                                        Left
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="push-email"
                                                        name="push-notifications"
                                                        type="radio"
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        value="right"
                                                        {...register("widgetPosition", { required: true })}
                                                    />
                                                    <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                                        Right
                                                    </label>
                                                </div>
                                            </div>
                                        </fieldset>

                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    {
                                        !!currentWidget && (
                                            <button
                                                type='button'
                                                onClick={() => setScriptModalVisible(true)}
                                                className= "mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Show Widget Script
                                            </button>
                                        )
                                    }
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="md:col-span-1 bg-gray-100">
                        {
                            !currentWidget || !currentWidget?.wallet_address.filter(wallet => !!wallet.public_address.length).length ? (
                                <div className='h-full flex flex-col items-center justify-center'>
                                    <EyeIcon width={50} height={50} />
                                    <div className='text-lg'>Widget Preview</div>
                                    <div>Fill and save the form to see widget</div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center h-full'>
                                    <WidgetComponent 
                                        widgetColor={currentWidget.widgetColor}
                                        firstName={currentWidget.firstName}
                                        availableWallets={currentWidget.wallet_address.filter(wallet => !!wallet.public_address.length)}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
            {
                !!currentWidget && (
                    <Transition appear show={scriptModalVisible} as={Fragment}>
                            <Dialog
                                as="div"
                                className="fixed inset-0 z-10 overflow-y-auto"
                                onClose={closeModal}
                            >
                            <div className="min-h-screen px-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                <Dialog.Overlay className="fixed inset-0" />
                                </Transition.Child>

                                <span
                                    className="inline-block h-screen align-middle"
                                    aria-hidden="true"
                                >
                                &#8203;
                                </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                <div className="inline-block w-3/5 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Copy This Script and paste into your site's html
                                    </Dialog.Title>
                                    <div className="rounded-md mt-2 bg-gray-900 text-gray-50 p-3 overflow-x-auto">
                                        <pre>
                                            <code className="text-sm">
                                                {widgetScript}
                                            </code>
                                        </pre>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={copyScript}
                                        >
                                            {copyButtonText}
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="inline-flex mr-2 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-gray-100 border border-transparent rounded-md hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                )
            }
        </>
    );

};

export default CustomiseWidgetForm;

