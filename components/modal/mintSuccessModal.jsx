const MintSuccessModal = (props) => {
    let { show, data, onHide } = props
    return (
        <div className={show ? 'block modal fade show ' : 'modal fade hidden'}>
            <div className="modal-dialog w-[600px]">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="walletModalLabel">
                            Your NFT
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                onHide()
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                            >
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                            </svg>
                        </button>
                    </div>
                    {/* <!-- Body --> */}
                    <div className="modal-body text-left p-6">
                        {data?.mintedNfts.map(val =>
                            <div>
                                <img src={val.imageUri === null ? "" : val.imageUri} />
                                <h5 className="text-white text-center mt-2">{val.name}</h5>
                            </div>
                        )}

                    </div>
                    {/* <!-- end body --> */}
                </div>
            </div>
        </div>
    )
}

export default MintSuccessModal;
