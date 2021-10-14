import React from "react";
import { useForm } from "react-hook-form";


function CustomiseWidgetForm() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            websiteUrl: "",
            widgetColor: "#e66465",
            widgetPosition: "right",
            walletAddresses: [
                { id: '0', name: 'Bitcoin', publicAddress: '' },
                { id: '1', name: 'Ethereum', publicAddress: '' },
                { id: '2', name: 'Solana', publicAddress: '' },
                { id: '3', name: 'USDT', publicAddress: '' }
            ]
        }
    });
    const onSubmit = data => console.log(data);


    return (
        <>
            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1 bg-gray-100">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Customise Widget</h3>
                            <p className="mt-1 text-sm text-gray-600">Add data to customise your widget</p>
                        </div>
                    </div>
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
                                                {...register("firstName")}
                                            />
                                        </div>

                                        {/* website URL section */}
                                        <div className="col-span-6">
                                            <div>
                                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                                    Website
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        https://
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="company-website"
                                                        id="company-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="www.example.com"
                                                        {...register("websiteUrl")}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* coin list section */}
                                        <div className="col-span-6">
                                            <div>
                                                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                                    Coins
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        Bitcoin
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="walletAddresses[0].publicAddress"
                                                        id="company-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        ref{...register("walletAddresses[0].publicAddress")}
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
                                                        name="walletAddresses[1].publicAddress"
                                                        id="company-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        // placeholder="Ethereum address"
                                                        {...register("walletAddresses[1].publicAddress")}
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
                                                        name="walletAddresses[2].publicAddress"
                                                        id="company-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        // placeholder="Solana address"
                                                        {...register("walletAddresses[2].publicAddress")}
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
                                                        name="walletAddresses[3].publicAddress"
                                                        id="company-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        // placeholder="USDT address"
                                                        {...register("walletAddresses[3].publicAddress")}
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
                                                        {...register("widgetColor", { required: true })}
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
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
        </>
    );

};

export default CustomiseWidgetForm;
