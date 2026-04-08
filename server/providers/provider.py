from abc import ABC, abstractmethod


class Provider(ABC):
    @abstractmethod
    def add(domain, destination, alias):
        pass

    @abstractmethod
    def get(domain):
        pass

    @abstractmethod
    def delete(alias):
        pass
