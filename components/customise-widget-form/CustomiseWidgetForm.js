import React from "react";
import { useForm } from "react-hook-form";


function CustomiseWidgetForm() {

    const { register, handleSubmit, formState: { errors } } = useForm();
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
                            <form method="POST" onSubmit={handleSubmit(onSubmit)}>
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
                                                    name="first-name"
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
                                            <fieldset>
                                                <div>
                                                    <legend className="text-base font-medium text-gray-900">Coins</legend>
                                                    <p className="text-sm text-gray-500">Select coins to diplay on widget</p>
                                                </div>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-everything"
                                                            name="btc-coin"
                                                            type="radio"
                                                            value="btc-coin"
                                                            {...register("btc")}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Bitcoin
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-email"
                                                            name="eth-coin"
                                                            type="radio"
                                                            value="eth-coin"
                                                            {...register("eth")}
                                                            className="focus:ring-red-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Ethereum
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-nothing"
                                                            name="sol-coin"
                                                            type="radio"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Solana
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-nothing"
                                                            name="matic-coin"
                                                            type="radio"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Matic
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-nothing"
                                                            name="usdt-coin"
                                                            type="radio"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                                            USDT
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>

                                            {/* widget color section */}
                                            <fieldset>
                                                <div>
                                                    <legend className="text-base font-medium text-gray-900">Color of widget</legend>
                                                    <p className="text-sm text-gray-500">Thematic color</p>
                                                </div>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-everything"
                                                            name="push-notifications"
                                                            type="radio"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-yellow-400 border-gray-300"
                                                            value="Yellow"
                                                            {...register("widgetColor", {required: true})}
                                                        />
                                                        <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Yellow
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-email"
                                                            name="push-notifications"
                                                            type="radio"
                                                            value="Red"
                                                            {...register("widgetColor", {required: true})}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-red-500 border-gray-300"
                                                        />
                                                        <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Red
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-nothing"
                                                            name="push-notifications"
                                                            type="radio"
                                                            value="Blue"
                                                            {...register("widgetColor", {required: true})}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-blue-400 border-gray-300"
                                                        />
                                                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Blue
                                                        </label>
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
                                                            {...register("widgetPosition", {required: true})}
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
                                                            {...register("widgetPosition", {required: true})}
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
