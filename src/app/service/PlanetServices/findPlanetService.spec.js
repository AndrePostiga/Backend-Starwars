/* eslint-disable no-undef */

import FindPlanetService from './findPlanetService';

const makeSut = () => {
  const sut = FindPlanetService;
  return {
    sut,
  };
};

describe('Find planet service', () => {
  it.skip('Should call find with correct value', async () => {
    // arrange
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'find');
    const arg = 'someId';

    // act
    sut.find(arg);

    // assert
    expect(findSpy).toHaveBeenCalledWith(arg);
  });

  it('Should call findByID on repository with correct id value', () => {});

  it('Should call findByName on repository with correct name value', () => {});
});
