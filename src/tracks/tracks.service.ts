import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Game } from 'src/games/entities/game.entity'
import { Playlist } from 'src/playlists/entities/playlist.entity'
import { Repository } from 'typeorm'
import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './entities/track.entity'

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) readonly trackRepository: Repository<Track>,
    @InjectRepository(Playlist)
    readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Game) readonly gameRepository: Repository<Game>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const playlists =
      createTrackDto.playlists &&
      (await Promise.all(
        createTrackDto.playlists.map((id) => this.findPlaylistById(id)),
      ))

    const games =
      createTrackDto.games &&
      (await Promise.all(
        createTrackDto.games.map((id) => this.findGameById(id)),
      ))

    const track = this.trackRepository.create({
      ...createTrackDto,
      games,
      playlists,
    })

    return this.trackRepository.save(track)
  }

  findAll() {
    return this.trackRepository.find({ relations: ['playlists'] })
  }

  async findOne(id: number) {
    const track = await this.trackRepository.findOne(id, {
      relations: ['playlist'],
    })

    if (!track) {
      throw new NotFoundException(`Track #${id} not found`)
    }

    return track
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const playlists =
      updateTrackDto.playlists &&
      (await Promise.all(
        updateTrackDto.playlists.map((id) => this.findPlaylistById(id)),
      ))

    const games =
      updateTrackDto.games &&
      (await Promise.all(
        updateTrackDto.games.map((id) => this.findGameById(id)),
      ))

    const track = await this.trackRepository.preload({
      id,
      ...updateTrackDto,
      playlists,
      games,
    })

    if (!track) {
      throw new NotFoundException(`Track #${id} not found`)
    }

    return this.trackRepository.save(track)
  }

  async remove(id: number) {
    const track = await this.trackRepository.findOne(id)

    return this.trackRepository.remove(track)
  }

  private async findGameById(id: number): Promise<Game> {
    const found = await this.gameRepository.findOne(id)

    if (found) {
      return found
    }

    throw new NotFoundException(`Game #${id} not found`)
  }

  private async findPlaylistById(id: number): Promise<Playlist> {
    const found = await this.playlistRepository.findOne(id)

    if (found) {
      return found
    }

    throw new NotFoundException(`Playlist #${id} not found`)
  }
}
