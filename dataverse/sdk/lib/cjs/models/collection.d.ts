export interface Collections {
    [key: string]: string[];
}
export interface PublicCollections {
    public: Collections;
    private: Collections;
}
