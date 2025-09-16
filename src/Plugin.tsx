import './tailwind.css';
import './index.css';
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {IDataEntryPluginProps} from "./Plugin.types";
import {PluginDetails} from "./Components/PluginDetails";

const queryClient = new QueryClient();
const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
    const {
        fieldsMetadata,
        setFieldValue,
        values,
        errors,
        warnings,
        formSubmitted,
        setContextFieldValue,
    } = propsFromParent;
    return (
        <QueryClientProvider
            client={queryClient}
        >
            <div
                className={'bg-white w-lvw flex'}
            >
                 <PluginDetails
                            fieldsMetadata={fieldsMetadata}
                            setFieldValue={setFieldValue}
                            values={values}
                            errors={errors}
                            warnings={warnings}
                            formSubmitted={formSubmitted}
                            setContextFieldValue={setContextFieldValue}
                        />
            </div>
        </QueryClientProvider>
    )
}

export default PluginInner;